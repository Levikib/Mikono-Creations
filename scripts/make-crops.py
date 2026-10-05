"""Cuts the crops listed in media/catalogue/crops.json from media/raw into media/work. Pixels are not altered."""
import json,os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)
from PIL import Image
def run():
    d=json.load(open('media/catalogue/crops.json'))
    for c in d['crops']:
        dst='media/work/'+c['out'];os.makedirs(os.path.dirname(dst),exist_ok=True)
        im=Image.open('media/raw/'+c['src']);x,y,w,h=c['box']
        im.crop((x,y,min(x+w,im.width),min(y+h,im.height))).save(dst,quality=95,subsampling=0,optimize=True)
    return len(d['crops'])
if __name__=='__main__':print('crops',run())
