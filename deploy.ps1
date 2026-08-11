<#
.SYNOPSIS
  Publica site/ na hospedagem da KingHost por FTPS.

.DESCRIPTION
  Roda da maquina do desenvolvedor, e nao no GitHub Actions: o servidor
  aceita login de qualquer origem mas recusa STOR de fora do Brasil.
  O runner do GitHub loga, enxerga o diretorio vazio e leva 550 em
  qualquer envio. Ha um .ftpaccess de 97 KB na raiz da conta, tamanho
  compativel com lista de IPs. Enquanto a KingHost nao liberar acesso
  externo (ou oferecer SFTP), a publicacao e manual por aqui.

  A lista de arquivos vem de "git ls-files", nunca de varredura de
  diretorio: site/images/SharePoint/ e site/docs/ estao no .gitignore e
  somam mais de 50 GB de material bruto do cliente. Varrer o disco
  mandaria tudo isso para o servidor.

.PARAMETER Dest
  Subpasta de destino, com barra no fim. Padrao "_preview/", usada para
  validar sem publicar. Passe "" para publicar na raiz web, no dia da
  virada.

.EXAMPLE
  .\deploy.ps1
  Publica em _preview/ para validacao.

.EXAMPLE
  .\deploy.ps1 -Dest ""
  Publica na raiz web. Pede confirmacao antes.
#>
param(
  [string]$Dest = '_preview/',
  [string]$User = 'imb-brasil'
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$arquivos = @(git ls-files site)
if ($arquivos.Count -eq 0) {
  throw 'Nenhum arquivo versionado em site/. Rode a partir da raiz do repositorio.'
}

# Publicar com a arvore suja significa subir algo que nao esta no
# historico — dificil de reproduzir depois. Avisa, mas nao impede.
$sujo = @(git status --porcelain site)
if ($sujo.Count -gt 0) {
  Write-Warning "$($sujo.Count) arquivo(s) modificado(s) e nao commitado(s) em site/."
  Write-Warning 'O que vai para o ar e o estado do disco, nao o do ultimo commit.'
}

$alvo = if ($Dest) { $Dest } else { 'RAIZ WEB (site no ar)' }
Write-Host ''
Write-Host "  Arquivos : $($arquivos.Count)"
Write-Host "  Servidor : web182.kinghost.net"
Write-Host "  Destino  : $alvo"
Write-Host ''

if (-not $Dest) {
  $r = Read-Host 'Isto publica na raiz web, visivel ao publico. Digite PUBLICAR para seguir'
  if ($r -ne 'PUBLICAR') { Write-Host 'Cancelado.'; exit 1 }
}

# Um curl para todos os arquivos: um login so, conexao reaproveitada.
# Hospedagem compartilhada limita conexoes simultaneas, entao subir
# arquivo a arquivo (ou em paralelo) faz o servidor comecar a recusar.
$cfg = Join-Path $env:TEMP 'imb-deploy.cfg'
$linhas = foreach ($f in $arquivos) {
  $rel = $f -replace '^site/', ''
  "url = `"ftp://web182.kinghost.net/$Dest$rel`""
  "upload-file = `"$f`""
}
Set-Content -Path $cfg -Value $linhas -Encoding ascii

try {
  # -u sem a senha: o curl pergunta uma vez. Senha nao fica em arquivo,
  # em variavel de ambiente nem no historico do PowerShell.
  # --ssl-reqd aborta se o servidor nao oferecer TLS, em vez de cair
  # para FTP em texto limpo.
  curl.exe --ssl-reqd --ftp-create-dirs -u $User --config $cfg
  if ($LASTEXITCODE -ne 0) {
    throw "curl terminou com codigo $LASTEXITCODE. Nada garantido no servidor."
  }
  Write-Host ''
  Write-Host "$($arquivos.Count) arquivos enviados para $alvo." -ForegroundColor Green
  if ($Dest -eq '_preview/') {
    Write-Host 'Confira em https://imb-brasil.com.br/_preview/'
    Write-Host '(so alcancavel por IPv6 enquanto o DNS nao virar; veja a Fase 4)'
  }
}
finally {
  Remove-Item $cfg -ErrorAction SilentlyContinue
}
