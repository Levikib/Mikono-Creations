"""Builds data/gallery.generated.json: every supplied photo (media/raw) and the video, each with a file the site can serve.
Photo files that already exist in public/media/story or public/media/moments are reused when they are the full original frame.
Everything else is copied untouched to public/media/gallery. Small sources (short side under 400 px) also get a square sand panel
version for the grid, so they are shown at their own size and never scaled up. Byte identical twins are listed once."""
import json,os,hashlib,shutil,re,glob
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)
from PIL import Image
SAND=(0xE1,0xD4,0xBF);NATIVE_PX=400
cfg=json.load(open('media/catalogue/gallery.json'))
merged={e['id']:e for e in json.load(open('media/manifest/merged.json'))}
src=json.load(open('data/photoSources.json'))
sha=lambda p:hashlib.sha1(open(p,'rb').read()).hexdigest()
ids=sorted(f for f in os.listdir('media/raw') if f.startswith('img-'))
groups={}
for i in ids:groups.setdefault(sha('media/raw/'+i),[]).append(i)
canon={i:g[0] for g in groups.values() for i in g}
twins={i:canon[i] for i in ids if canon[i]!=i}
# existing public files by the raw photo they were cut from
existing={}
for f,rid in src['files'].items():
    p='public'+f
    if os.path.exists(p):existing.setdefault(canon.get(rid,rid),[]).append(f)
shutil.rmtree('public/media/gallery',ignore_errors=True);os.makedirs('public/media/gallery')
items=[];reused=0
for i in ids:
    if i in twins:continue
    c=cfg['items'].get(i)
    if not c:raise SystemExit(f'no gallery entry for {i}')
    rw,rh=Image.open('media/raw/'+i).size
    chosen=None
    if i in cfg.get('file',{}):
        f=cfg['file'][i]
        if f.startswith('public/'):chosen='/'+f[len('public/'):]
        else:
            dst='public/media/gallery/'+i;shutil.copy2(f,dst);chosen='/media/gallery/'+i
    else:
        for f in existing.get(i,[]):
            if Image.open('public'+f).size==(rw,rh) and sha('public'+f)==sha('media/raw/'+i):chosen=f;reused+=1;break
        if not chosen:
            dst='public/media/gallery/'+i
            if i in cfg.get('rotate',{}):
                im=Image.open('media/raw/'+i);im.transpose({'cw90':Image.ROTATE_270,'ccw90':Image.ROTATE_90}[cfg['rotate'][i]]).save(dst,quality=95,subsampling=0,optimize=True)
            else:shutil.copy2('media/raw/'+i,dst)
            chosen='/media/gallery/'+i
    w,h=Image.open('public'+chosen).size
    e={"id":i,"src":chosen,"w":w,"h":h,"tab":c['tab'],"caption":c['caption'],"alt":cfg.get('altOverrides',{}).get(i) or merged[i]['proposed_alt_text'],"twins":[t for t,k in twins.items() if k==i]}
    if min(w,h)<NATIVE_PX:
        im=Image.open('public'+chosen).convert('RGB');side=max(240,int(max(w,h)*1.12));cv=Image.new('RGB',(side,side),SAND);cv.paste(im,((side-w)//2,(side-h)//2))
        fp='public/media/gallery/'+i.replace('.jpg','-frame.jpg');cv.save(fp,quality=93,subsampling=0,optimize=True);e['cardSrc']='/media/gallery/'+i.replace('.jpg','-frame.jpg')
    items.append(e)
# the video: the file is copied as it is, the poster is a frame cut from it
v=cfg['video'];os.makedirs('public/media/video',exist_ok=True)
shutil.copy2('media/raw/'+v['id'],'public/media/video/market-stall.mp4')
import cv2
cap=cv2.VideoCapture('media/raw/'+v['id']);cap.set(1,8*24);ok,fr=cap.read();cv2.imwrite('public/media/video/market-stall-poster.jpg',fr,[cv2.IMWRITE_JPEG_QUALITY,90])
video={"id":v['id'],"src":"/media/video/market-stall.mp4","poster":"/media/video/market-stall-poster.jpg","w":fr.shape[1],"h":fr.shape[0],"tab":v['tab'],"caption":v['caption'],"alt":v['alt']}
json.dump({"tabs":cfg['tabs'],"items":items,"video":video},open('data/gallery.generated.json','w'),indent=1)
print('photos',len(items),'reused files',reused,'twins',twins)
