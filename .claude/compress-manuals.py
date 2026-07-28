#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Reduz o peso dos manuais em site/manuals/ sem mexer no texto nem nos vetores.

Os PDFs pesam ~126 MB, e 120 MB disso são imagens — a maioria já é JPEG, só que
gravada em qualidade altíssima. Este script reprocessa cada imagem:

  * limita o maior lado a MAX_SIDE px (≈150 DPI quando a foto ocupa a página inteira);
  * regrava em JPEG com qualidade JPEG_Q;
  * mantém o original se a versão nova não ficar menor.

Não toca em: máscaras (/ImageMask), /SMask (canal alfa — recompressão com perda
gera halo), imagens pequenas, e CMYK (o transform Adobe inverte valores no
round-trip do Pillow e estoura a cor).

    python .claude/compress-manuals.py            # grava em site/manuals/
    python .claude/compress-manuals.py --dry-run  # só relatório
    python .claude/compress-manuals.py --out DIR  # grava em outro diretório
"""

import argparse
import io
import os
import shutil
import sys
import glob

import pikepdf
from PIL import Image

MAX_SIDE = 1600   # px — a 150 DPI cobre uma página A4 inteira com folga
JPEG_Q = 75
MIN_SIDE = 300    # abaixo disso é ícone/logo: não compensa e o risco de borrar é alto

MANUALS = os.path.join(os.path.dirname(__file__), '..', 'site', 'manuals')


def smask_ids(pdf):
    """Objetos usados como canal alfa — reprocessar com perda cria halo na borda."""
    ids = set()
    for obj in pdf.objects:
        try:
            for key in ('/SMask', '/Mask'):
                ref = obj.get(key)
                if ref is not None and hasattr(ref, 'objgen'):
                    ids.add(ref.objgen)
        except Exception:
            continue
    return ids


COLORSPACE = {'RGB': '/DeviceRGB', 'L': '/DeviceGray'}


def recompress_image(obj):
    """Devolve (bytes_novos, w, h, colorspace) ou None se não valer a pena."""
    try:
        pil = pikepdf.PdfImage(obj).as_pil_image()
    except Exception:
        return None

    if pil.mode not in ('RGB', 'L'):
        if pil.mode in ('P', 'RGBA', 'LA', '1'):
            pil = pil.convert('RGB' if pil.mode in ('P', 'RGBA') else 'L')
        else:
            return None  # CMYK e afins: fora

    w, h = pil.size
    if max(w, h) < MIN_SIDE:
        return None

    if max(w, h) > MAX_SIDE:
        scale = MAX_SIDE / float(max(w, h))
        pil = pil.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)

    buf = io.BytesIO()
    pil.save(buf, format='JPEG', quality=JPEG_Q, optimize=True, progressive=True)
    return buf.getvalue(), pil.size[0], pil.size[1], COLORSPACE[pil.mode]


def process(path, out_path, dry_run=False):
    before = os.path.getsize(path)
    pdf = pikepdf.open(path)
    protected = smask_ids(pdf)
    touched = 0

    for obj in pdf.objects:
        try:
            if obj.get('/Subtype') != '/Image':
                continue
            if obj.get('/ImageMask'):
                continue
            if obj.objgen in protected:
                continue
        except Exception:
            continue

        original = len(obj.read_raw_bytes())
        result = recompress_image(obj)
        if not result:
            continue
        data, w, h, cs = result
        if len(data) >= original:
            continue  # já estava melhor do que o que eu faria

        obj.write(data, filter=pikepdf.Name('/DCTDecode'))
        obj['/Width'] = w
        obj['/Height'] = h
        obj['/ColorSpace'] = pikepdf.Name(cs)
        obj['/BitsPerComponent'] = 8
        for dead in ('/DecodeParms', '/Decode'):
            if dead in obj:
                del obj[dead]
        touched += 1

    if dry_run:
        pdf.close()
        return before, None, touched

    tmp = out_path + '.tmp'
    pdf.save(tmp, compress_streams=True,
             object_stream_mode=pikepdf.ObjectStreamMode.generate)
    pdf.close()
    os.replace(tmp, out_path)
    return before, os.path.getsize(out_path), touched


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--out', default=None, help='diretório de saída (padrão: no lugar)')
    args = ap.parse_args()

    files = sorted(glob.glob(os.path.join(MANUALS, '*.pdf')))
    if not files:
        sys.exit('nenhum PDF em site/manuals/')
    if args.out:
        os.makedirs(args.out, exist_ok=True)

    tot_before = tot_after = 0
    for path in files:
        name = os.path.basename(path)
        out_path = os.path.join(args.out, name) if args.out else path
        before, after, touched = process(path, out_path, args.dry_run)
        tot_before += before
        tot_after += after if after else before
        if after:
            print('%-48s %6.1f MB -> %5.1f MB  (-%2.0f%%, %d imgs)'
                  % (name, before / 1e6, after / 1e6, 100 * (1 - after / float(before)), touched))
        else:
            print('%-48s %6.1f MB  (%d imgs seriam reprocessadas)' % (name, before / 1e6, touched))

    print('-' * 78)
    print('TOTAL %38s %6.1f MB -> %5.1f MB  (-%.0f%%)'
          % ('', tot_before / 1e6, tot_after / 1e6, 100 * (1 - tot_after / float(tot_before))))


if __name__ == '__main__':
    main()
