import json, os, re, sys
# Regenerates packages/skins/*/src/icons.ts from the upstream icon libraries.
# Usage: python3 scripts/gen-icon-sets.py <dir>
# <dir> holds the extracted `npm pack` output of lucide-static, @phosphor-icons/core,
# @tabler/icons, heroicons and @material-symbols/svg-400 (versions in LIBS below).
import sys
D=sys.argv[1]
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'packages', 'skins')
LIBS={
 'lucide': (D+'/lucide-static-1.77.0/package/icons/{}.svg','Lucide (lucide-static 1.77.0), ISC License, https://lucide.dev'),
 'ph-light': (D+'/phosphor-icons-core-2.1.1/package/assets/light/{}-light.svg','Phosphor Icons (@phosphor-icons/core 2.1.1), MIT License, https://phosphoricons.com'),
 'ph-bold': (D+'/phosphor-icons-core-2.1.1/package/assets/bold/{}-bold.svg','Phosphor Icons (@phosphor-icons/core 2.1.1), MIT License, https://phosphoricons.com'),
 'ph-fill': (D+'/phosphor-icons-core-2.1.1/package/assets/fill/{}-fill.svg','Phosphor Icons (@phosphor-icons/core 2.1.1), MIT License, https://phosphoricons.com'),
 'tabler': (D+'/tabler-icons-3.52.0/package/icons/outline/{}.svg','Tabler Icons (@tabler/icons 3.52.0), MIT License, https://tabler.io/icons'),
 'tabler-filled': (D+'/tabler-icons-3.52.0/package/icons/filled/{}.svg','Tabler Icons (@tabler/icons 3.52.0), MIT License, https://tabler.io/icons'),
 'hero': (D+'/heroicons-2.2.0/package/24/outline/{}.svg','Heroicons 2.2.0, MIT License, https://heroicons.com'),
 'hero-solid': (D+'/heroicons-2.2.0/package/24/solid/{}.svg','Heroicons 2.2.0, MIT License, https://heroicons.com'),
 'material': (D+'/material-symbols-svg-400-0.49.0/package/rounded/{}.svg','Material Symbols Rounded (@material-symbols/svg-400 0.49.0), Apache License 2.0, https://fonts.google.com/icons'),
}
# name -> per-lib file stem. A list tries alternatives; '!lib:stem' switches library for one icon.
MAP={
 'lucide': dict(play='play',pause='pause',replay='rotate-ccw',volumeHigh='volume-2',volumeLow='volume-1',volumeMuted='volume-x',fullscreen='maximize',fullscreenExit='minimize',pip='picture-in-picture-2',captions='captions',settings='settings',forward='rotate-cw',backward='rotate-ccw',next='skip-forward',previous='skip-back',cast='cast',chapters='list',check='check',chevron='chevron-right',theater='rectangle-horizontal'),
 'ph': dict(play='play',pause='pause',replay='arrow-counter-clockwise',volumeHigh='speaker-high',volumeLow='speaker-low',volumeMuted='speaker-x',fullscreen='corners-out',fullscreenExit='corners-in',pip='picture-in-picture',captions='closed-captioning',settings='gear-six',forward='arrow-clockwise',backward='arrow-counter-clockwise',next='skip-forward',previous='skip-back',cast='screencast',chapters='list-bullets',check='check',chevron='caret-right',theater='rectangle'),
 'tabler': dict(play='player-play',pause='player-pause',replay='rotate',volumeHigh='volume',volumeLow='volume-2',volumeMuted='volume-off',fullscreen='maximize',fullscreenExit='minimize',pip='picture-in-picture',captions='badge-cc',settings='settings',forward='rotate-clockwise',backward='rotate',next='player-skip-forward',previous='player-skip-back',cast='cast',chapters='list',check='check',chevron='chevron-right',theater='rectangle'),
 'hero': dict(play='play',pause='pause',replay='arrow-path',volumeHigh='speaker-wave',volumeLow='speaker-wave',volumeMuted='speaker-x-mark',fullscreen='arrows-pointing-out',fullscreenExit='arrows-pointing-in',settings='cog-6-tooth',next='forward',previous='backward',chapters='list-bullet',check='check',chevron='chevron-right',cast='signal'),
 'material': dict(play='play_arrow-fill',pause='pause-fill',replay='replay',volumeHigh='volume_up-fill',volumeLow='volume_down-fill',volumeMuted='volume_off-fill',fullscreen='fullscreen',fullscreenExit='fullscreen_exit',pip='picture_in_picture_alt',captions='closed_caption-fill',settings='settings-fill',next='skip_next-fill',previous='skip_previous-fill',cast='cast',chapters='list',check='check',chevron='chevron_right',theater='crop_16_9'),
}
SKINS={
 'cinema': ('ph-light','ph', {}),
 'studio': ('tabler','tabler', {}),
 'creator': ('lucide','lucide', {}),
 'learn': ('hero','hero', {}),
 'campus': ('ph-bold','ph', {'play':'ph-fill','pause':'ph-fill'}),
 'stream': ('tabler-filled','tabler', {}),
 'tube': ('material','material', {}),
 'feed': ('hero-solid','hero', {}),
}
FILLED_OK={'tabler-filled'}
def clean(src, lib):
    s=open(src).read()
    s=re.sub(r'<!--.*?-->','',s,flags=re.S); s=re.sub(r'<\?xml.*?\?>','',s)
    head,rest=s.split('>',1)
    head=re.sub(r'\s(width|height|class|data-slot|aria-hidden)="[^"]*"','',head)
    s=head+'>'+rest
    s=re.sub(r'\s+',' ',s).strip()
    vb=re.search(r'viewBox="([^"]+)"',s); size=abs(float(vb.group(1).split()[-1])) if vb else 24
    dec=0 if size>=500 else 1 if size>=100 else 2
    def rnd(m):
        v=round(float(m.group(0)),dec); t=(f'{v:.{dec}f}'.rstrip('0').rstrip('.') if dec else str(int(v)))
        if t in ('-0',''): t='0'
        t=t.replace('0.','.',1) if t.startswith('0.') else t.replace('-0.','-.',1)
        return t if t.startswith('-') else ' '+t
    s=re.sub(r'(?<=d=")[^"]*', lambda m: re.sub(r' {2,}',' ',re.sub(r'([A-Za-z]) ',r'\1',re.sub(r'-?\d*\.\d+', rnd, m.group(0)))), s)
    s=re.sub(r'(?<=d=") ', '', s)
    s=s.replace('<svg ','<svg class="tp-icon" ',1)
    if lib=='material' and 'fill=' not in s.split('>')[0]: s=s.replace('<svg ','<svg fill="currentColor" ',1)
    return s
for skin,(lib,mapkey,overrides) in SKINS.items():
    out={}; used=set()
    for name,stem in MAP[mapkey].items():
        l=overrides.get(name,lib)
        path=LIBS[l][0].format(stem)
        if lib=='tabler-filled' and not os.path.exists(path): l='tabler'; path=LIBS[l][0].format(stem)
        if not os.path.exists(path): print('missing',skin,name,path); continue
        out[name]=clean(path,l); used.add(LIBS[l][1])
    body='\n'.join(f"  {k}: {json.dumps(v)}," for k,v in out.items())
    ts=f"""// Icon set for the {skin} skin. Generated from:
{chr(10).join('//   '+u for u in sorted(used))}
// Names not listed here fall back to the default Tomato icons.
import type {{ IconSet }} from '@tomato-player/ui';

export const {skin}Icons: IconSet = {{
{body}
}};
"""
    open(f'{ROOT}/{skin}/src/icons.ts','w').write(ts)
    print(skin,len(out))
