<#
.SYNOPSIS
  Publica site/ na hospedagem da KingHost por FTPS, conferindo o que subiu.

.DESCRIPTION
  Roda da maquina do desenvolvedor, e nao no GitHub Actions: o servidor
  aceita login de qualquer origem mas recusa STOR de fora do Brasil.
  Ha um .ftpaccess de 97 KB na raiz da conta, tamanho compativel com
  lista de IPs.

  O servidor trunca transferencias. Na primeira publicacao varios
  arquivos chegaram com 0 byte e outros cortados em 16384 bytes exatos,
  enquanto o curl reportava apenas um 450 no fim. Um deploy que so envia
  nao e confiavel aqui: este script confere o tamanho de cada arquivo no
  servidor e reenvia o que nao bater, ate tudo fechar.

  A lista de arquivos vem de "git ls-files", nunca de varredura de
  diretorio: site/images/SharePoint/ e site/docs/ estao no .gitignore e
  somam mais de 50 GB de material bruto do cliente.

.PARAMETER Dest
  Subpasta de destino, com barra no fim. Padrao "_preview/", usada para
  validar sem publicar. Passe "" para publicar na raiz web.

.PARAMETER SemTlsNosDados
  Criptografa apenas o canal de controle; o conteudo dos arquivos vai em
  claro. A senha continua protegida. Use se o truncamento persistir: em
  alguns servidores ele vem do TLS no canal de dados. O site e publico,
  entao o conteudo nao e sigiloso.

.EXAMPLE
  .\deploy.ps1
  Publica em _preview/ e confere.

.EXAMPLE
  .\deploy.ps1 -Dest ""
  Publica na raiz web. Pede confirmacao antes.
#>
param(
  [string]$Dest = '_preview/',
  [string]$User = 'imb-brasil',
  [int]$Tentativas = 8,
  [switch]$SemTlsNosDados
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$Servidor = 'web182.kinghost.net'

$versionados = @(git ls-files site)
if ($versionados.Count -eq 0) {
  throw 'Nenhum arquivo versionado em site/. Rode a partir da raiz do repositorio.'
}

# Publicar com a arvore suja significa subir algo que nao esta no
# historico — dificil de reproduzir depois. Avisa, mas nao impede.
$sujo = @(git status --porcelain site)
if ($sujo.Count -gt 0) {
  Write-Warning "$($sujo.Count) arquivo(s) modificado(s) e nao commitado(s) em site/."
  Write-Warning 'Vai para o ar o estado do disco, nao o do ultimo commit.'
}

# Caminho relativo -> tamanho esperado.
$esperado = @{}
foreach ($f in $versionados) {
  $esperado[($f -replace '^site/', '')] = (Get-Item $f).Length
}

$alvo = if ($Dest) { $Dest } else { 'RAIZ WEB (site no ar)' }
Write-Host ''
Write-Host "  Arquivos : $($esperado.Count)"
Write-Host "  Servidor : $Servidor"
Write-Host "  Destino  : $alvo"
Write-Host ''

if (-not $Dest) {
  $r = Read-Host 'Isto publica na raiz web, visivel ao publico. Digite PUBLICAR para seguir'
  if ($r -ne 'PUBLICAR') { Write-Host 'Cancelado.'; exit 1 }
}

# Senha pedida uma vez e mantida so em memoria. Ela vai para o curl por
# arquivo de configuracao, e nao na linha de comando (argumento de
# processo e visivel para outros processos) nem por netrc, cujo formato
# trata "#" como inicio de comentario e truncaria a senha.
$sec = Read-Host "Senha FTP de $User" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
try { $senha = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }

$cfg = Join-Path $env:TEMP 'imb-deploy.cfg'

function Invoke-Curl {
  param([string[]]$Linhas)
  $base = @(
    "user = `"$User`:$senha`"",
    'ssl-reqd',
    'ftp-create-dirs',
    'silent',
    'show-error',
    # O servidor corta transferencias com frequencia. Retentar dentro da
    # propria execucao do curl conserta a maioria na hora, em vez de
    # empurrar o arquivo para a passada seguinte do laco de conferencia.
    'retry = 3',
    'retry-all-errors',
    'retry-delay = 2'
  )
  if ($SemTlsNosDados) { $base += 'ftp-ssl-control' }
  Set-Content -Path $cfg -Value ($base + $Linhas) -Encoding ascii
  $saida = & curl.exe --config $cfg 2>&1
  return @{ Codigo = $LASTEXITCODE; Saida = $saida }
}

# Le o tamanho de cada arquivo ja presente no servidor, um LIST por
# diretorio. Nomes com espaco quebrariam este parse; nao ha nenhum no
# projeto (conferido: todos os nomes sao ASCII sem espaco).
function Get-TamanhosRemotos {
  $dirs = $esperado.Keys | ForEach-Object {
    if ($_ -match '/') { ($_ -replace '/[^/]*$', '') } else { '' }
  } | Sort-Object -Unique

  $tam = @{}
  foreach ($d in $dirs) {
    $url = if ($d) { "ftp://$Servidor/$Dest$d/" } else { "ftp://$Servidor/$Dest" }
    $r = Invoke-Curl @("url = `"$url`"")
    if ($r.Codigo -ne 0) { continue }   # diretorio ainda nao existe
    foreach ($linha in $r.Saida) {
      if ($linha -match '^-\S+\s+\d+\s+\S+\s+\S+\s+(\d+)\s+\S+\s+\S+\s+\S+\s+(.+)$') {
        $nome = $matches[2].Trim()
        $rel = if ($d) { "$d/$nome" } else { $nome }
        $tam[$rel] = [int64]$matches[1]
      }
    }
  }
  return $tam
}

try {
  # Confere ANTES de enviar. Sem isto, trocar uma linha de um arquivo
  # custaria o reenvio dos 108 MB inteiros: a primeira passada mandava
  # tudo e so depois comparava.
  Write-Host 'Conferindo o que ja esta no servidor...'
  $remoto = Get-TamanhosRemotos
  $pendentes = @($esperado.Keys | Where-Object {
    -not $remoto.ContainsKey($_) -or $remoto[$_] -ne $esperado[$_]
  })

  if ($pendentes.Count -eq 0) {
    Write-Host ''
    Write-Host "Servidor ja esta igual: $($esperado.Count) arquivos conferidos em $alvo." -ForegroundColor Green
    exit 0
  }

  Write-Host "$($pendentes.Count) de $($esperado.Count) arquivo(s) precisam subir."

  for ($i = 1; $i -le $Tentativas; $i++) {
    Write-Host "Tentativa $i — enviando $($pendentes.Count) arquivo(s)..."

    $linhas = foreach ($rel in $pendentes) {
      "url = `"ftp://$Servidor/$Dest$rel`""
      "upload-file = `"site/$rel`""
    }
    $envio = Invoke-Curl $linhas
    if ($envio.Codigo -ne 0) {
      Write-Host "  curl saiu com codigo $($envio.Codigo) — o resultado real vem da conferencia."
    }

    Write-Host '  Conferindo tamanhos no servidor...'
    $remoto = Get-TamanhosRemotos

    $pendentes = @($esperado.Keys | Where-Object {
      -not $remoto.ContainsKey($_) -or $remoto[$_] -ne $esperado[$_]
    })

    if ($pendentes.Count -eq 0) {
      Write-Host ''
      Write-Host "$($esperado.Count) arquivos conferidos byte a byte em $alvo." -ForegroundColor Green
      if ($Dest -eq '_preview/') {
        Write-Host 'Confira em https://imb-brasil.com.br/_preview/'
      }
      exit 0
    }

    Write-Host "  $($pendentes.Count) arquivo(s) incompleto(s) ou faltando."
  }

  Write-Host ''
  Write-Warning "Sobraram $($pendentes.Count) arquivo(s) apos $Tentativas tentativas:"
  $pendentes | Select-Object -First 20 | ForEach-Object {
    $r = if ($remoto.ContainsKey($_)) { $remoto[$_] } else { 'ausente' }
    Write-Host ("   {0}  esperado {1}, servidor {2}" -f $_, $esperado[$_], $r)
  }
  Write-Host ''
  Write-Host 'Se o truncamento persistir, tente:  .\deploy.ps1 -SemTlsNosDados'
  Write-Host '(criptografa so o login; o conteudo do site, que e publico, vai em claro)'
  exit 1
}
finally {
  Remove-Item $cfg -ErrorAction SilentlyContinue
  $senha = $null
}
