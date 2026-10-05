import json,glob,os,shutil,re,sys
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)
sys.path.insert(0,os.path.join(root,'scripts'))
from PIL import Image
import importlib.util
_s=importlib.util.spec_from_file_location('make_crops',os.path.join(root,'scripts','make-crops.py'));_m=importlib.util.module_from_spec(_s);_s.loader.exec_module(_m)
_m.run()  # cuts the crops listed in media/catalogue/crops.json into media/work
SAND=(0xE1,0xD4,0xBF)  # --color-sand: the photo frame colour
NATIVE_PX=400  # a source with a short side under this is never upscaled or blurred
def rotate_in_place(path,how):
    # Source photos that were saved sideways. 'cw90' turns the picture a quarter turn clockwise.
    im=Image.open(path);t={'cw90':Image.ROTATE_270,'ccw90':Image.ROTATE_90,'180':Image.ROTATE_180}[how]
    im.transpose(t).save(path,quality=95,subsampling=0,optimize=True)
CAT={"safari":"Safari animals","domestic":"Domestic animals","more":"More animals","wall-art":"Wall art","dolls":"Dolls"}
shutil.rmtree('public/media/products',ignore_errors=True)
out=[];used=0;skipped=[]
def frame(dst):
    # Small sources get a square card version: the untouched photo centred at its own size on a soft sand panel. Never scaled.
    im=Image.open(dst).convert('RGB');w,h=im.size
    if min(w,h)>=NATIVE_PX:return None
    side=max(240,int(max(w,h)*1.12));c=Image.new('RGB',(side,side),SAND);c.paste(im,((side-w)//2,(side-h)//2))
    fd=re.sub(r'(\.[a-z]+)$',r'-frame.jpg',dst);c.save(fd,quality=93,subsampling=0,optimize=True);return "/"+fd[len('public/'):]
KEYS=('role','bg','focal','shownSize','width','height','quality','alt','source_id','client_review')
def entry(im,dst):
    e={k:im.get(k) for k in KEYS if im.get(k) is not None or k in('shownSize',)}|{"src":"/"+dst[len('public/'):]}
    fr=frame(dst)
    if fr:e['cardSrc']=fr
    return e
for f in sorted(glob.glob('media/catalogue/*.json')):
    d=json.load(open(f))
    if 'products' not in d:continue  # story-content, crops and gallery files hold no products
    for p in d['products']:
        slug=p['slug'];cws=[]
        for cw in p.get('colourways',[]):
            imgs=[]
            for i,im in enumerate(cw.get('images',[])):
                src=im['file']
                if not os.path.exists(src):skipped.append((slug,src));continue
                ext=os.path.splitext(src)[1].lower()
                name=f"{slug}-{cw['key']}-{i+1:02d}{ext}"
                dst=f"public/media/products/{slug}/{name}"
                os.makedirs(os.path.dirname(dst),exist_ok=True);shutil.copy2(src,dst);used+=1
                if im.get('rotate'):rotate_in_place(dst,im['rotate'])
                imgs.append(entry(im,dst))
            if imgs:cws.append({"key":cw['key'],"label":cw['label'],"images":imgs})
        rng=[]
        # A product with no colourway photo at all still lists, with its range photos and a single 'ask' colour.
        ask=(not cws) and bool(p.get('range_images'))
        if ask:
            imgs=[]
            for i,im in enumerate(p.get('range_images',[])):
                src=im['file']
                if not os.path.exists(src):skipped.append((slug,src));continue
                ext=os.path.splitext(src)[1].lower()
                dst=f"public/media/products/{slug}/{slug}-ask-{i+1:02d}{ext}"
                os.makedirs(os.path.dirname(dst),exist_ok=True);shutil.copy2(src,dst);used+=1
                imgs.append(entry(im,dst))
            if imgs:cws.append({"key":"ask","label":"Colours vary","images":imgs})
        for i,im in enumerate([] if ask else p.get('range_images',[])):
            src=im['file']
            if not os.path.exists(src):continue
            ext=os.path.splitext(src)[1].lower()
            dst=f"public/media/products/{slug}/{slug}-range-{i+1:02d}{ext}"
            os.makedirs(os.path.dirname(dst),exist_ok=True);shutil.copy2(src,dst);used+=1
            rng.append(entry(im,dst))
        if not cws and not rng:continue
        e={"slug":slug,"species":p.get('species',slug),"category":p.get('category','more'),"colourways":cws,"range":rng}
        if ask and cws:e["colourAsk"]=True
        out.append(e)
json.dump({"sizes":["S","M","L","XL"],"categories":CAT,"products":out},open('data/catalogue.generated.json','w'),indent=1)
print("products",len(out),"images",used,"missing",skipped)
for p in out:print(p['slug'],p['category'],len(p['colourways']),len(p['range']),'HIDDEN' if p.get('hidden') else '')
