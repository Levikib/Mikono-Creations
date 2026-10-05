import sys
from PIL import Image
tag,name,h=sys.argv[1],sys.argv[2],int(sys.argv[3])
im=Image.open(f'shots/{tag}-{name}.png')
n=0
for y in range(0,im.height,h):
    im.crop((0,y,im.width,min(y+h,im.height))).save(f'shots/{tag}-{name}-s{n}.png');n+=1
print(n)
