from pathlib import Path
import json,hashlib
from PIL import Image

root=Path(__file__).resolve().parents[1]
public=root/'public'
files=json.loads((root/'content/publication-assets.json').read_text(encoding='utf-8'))
alias_path=root/'content/asset-aliases.json'
aliases=json.loads(alias_path.read_text(encoding='utf-8')) if alias_path.exists() else {}
groups={}
for item in files:
    source=public/item['url'].lstrip('/')
    digest=hashlib.sha256(source.read_bytes()).hexdigest()
    groups.setdefault(digest,[]).append(item)
saved=0
unique=[]
for digest,items in groups.items():
    primary=items[0]
    unique.append((digest,primary))
    for item in items[1:]:
        aliases[item['url']]=primary['url']
        saved+=item['bytes']
original_total=sum(item['bytes'] for item in files)
checked=[]
for digest,item in sorted(unique,key=lambda pair:pair[1]['bytes'],reverse=True):
    if original_total-saved<880_000_000: break
    if not item['url'].lower().endswith('.png'): continue
    source=public/item['url'].lstrip('/')
    target=public/'optimized'/f'{digest}.webp'
    target.parent.mkdir(exist_ok=True)
    with Image.open(source) as image:
        if getattr(image,'n_frames',1)>1: continue
        if image.mode not in ('1','RGB','RGBA','P','L','LA'): continue
        if image.info.get('gamma') not in (None,0.45455): continue
        original=image.convert('RGBA')
        kwargs={'lossless':True,'quality':100,'method':4,'exact':True}
        if image.info.get('icc_profile'):kwargs['icc_profile']=image.info['icc_profile']
        if image.info.get('exif'):kwargs['exif']=image.info['exif']
        image.save(target,'WEBP',**kwargs)
        with Image.open(target) as result:
            assert result.size==image.size and result.convert('RGBA').tobytes()==original.tobytes(),str(source)
            assert result.info.get('icc_profile')==image.info.get('icc_profile'),str(source)
    size=target.stat().st_size
    if size>=item['bytes']:
        target.unlink()
        continue
    saved+=item['bytes']-size
    aliases[item['url']]='/optimized/'+target.name
    checked.append({'source':item['url'],'published':aliases[item['url']],'sourceBytes':item['bytes'],'publishedBytes':size,'pixelsIdentical':True})
    print(json.dumps({'verifiedImages':len(checked),'resourceBytes':original_total-saved}),flush=True)
for url in list(aliases):
    dest=aliases[url]
    while dest in aliases:dest=aliases[dest]
    aliases[url]=dest
(root/'content/asset-aliases.json').write_text(json.dumps(aliases,ensure_ascii=False,indent=2),encoding='utf-8')
(root/'verification/lossless-report.json').write_text(json.dumps({'originalResourceBytes':original_total,'publishedResourceBytes':original_total-saved,'savedBytes':saved,'images':checked},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'publishedResourceBytes':original_total-saved,'verifiedImages':len(checked),'aliasCount':len(aliases)}))
