import sys
def page(d):
    A = d=='a'
    title = "Savanna Dusk Glass" if A else "Daylight Clay Tech"
    fonts = ("bricolage","geist","geistmono") if A else ("unbounded","instrument","dmmono")
    eyebrow = lambda t: f'<span class="eyebrow">{t}</span>'
    products=[("giraffe-cream.jpg","Cream Giraffe","Brown patches, S to XL","Safari"),
              ("lion.jpg","Tan Lion","Brown yarn mane, S to XL","Safari"),
              ("elephant.jpg","Slate Blue Elephant","Tusks in cream, S to XL","Safari"),
              ("zebra.jpg","Black and White Zebra","Hand-striped, S to XL","Safari")]
    cards="".join(f'''<article class="pcard tilt"><a class="pimg" href="#"><img src="assets/img/{im}" alt="{n}, handmade crochet toy" loading="lazy"><span class="chip">{tag}</span></a>
<div class="pbody"><h3>{n}</h3><p>{m}</p><a class="btn btn-sm" href="#"><span data-ic="whatsapp"></span>Ask for price</a></div></article>''' for im,n,m,tag in products)
    icons=["yarn","hook","hands","giraffe","elephant","lion","rhino","zebra","rabbit","gift","truck","whatsapp"]
    lab=["Yarn ball","Hook","Hands","Giraffe","Elephant","Lion","Rhino","Zebra","Rabbit","Gift","Delivery","WhatsApp"]
    isheet="".join(f'<div class="itile"><span class="ibig" data-ic="{i}"></span><span class="ismall" data-ic="{i}"></span><b>{l}</b></div>' for i,l in zip(icons,lab))
    hero_art = '''<div class="stage"><div class="orb"></div><img class="cut c-lion" src="assets/img/cut-lion.png" alt="Tan crochet lion with a brown yarn mane"><img class="cut c-giraffe" src="assets/img/cut-giraffe.png" alt="Yellow crochet giraffe"><img class="cut c-rabbit" src="assets/img/cut-rabbit.png" alt="Brown crochet rabbit in a blue vest"><div class="glass tag t1"><span data-ic="hands"></span><div><small>MADE BY</small><b>25+ women, Nairobi</b></div></div><div class="glass tag t2"><span data-ic="yarn"></span><div><small>YARN</small><b>Recycled, zero plastic</b></div></div></div>'''
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mikono {title} prototype</title>
<style>
@font-face{{font-family:Disp;src:url(assets/fonts/{fonts[0]}.woff2) format("woff2");font-weight:200 900;font-stretch:75% 100%;font-display:swap}}
@font-face{{font-family:Body;src:url(assets/fonts/{fonts[1]}.woff2) format("woff2");font-weight:300 700;font-stretch:75% 100%;font-display:swap}}
@font-face{{font-family:Mono;src:url(assets/fonts/{fonts[2]}.woff2) format("woff2");font-weight:400 600;font-display:swap}}
</style><link rel="stylesheet" href="{d}.css"></head><body class="dir-{d}">
<div class="grain" aria-hidden="true"></div>
<header class="nav-wrap"><nav class="nav" aria-label="Main">
 <a class="brand" href="#"><span class="mark" data-ic="yarn"></span><span>Mikono</span></a>
 <ul class="links"><li><button class="lk" data-mega aria-expanded="false" aria-controls="mega">Shop<span data-ic="chev"></span></button></li><li><a class="lk" href="#">Gifts</a></li><li><a class="lk" href="#">Custom</a></li><li><a class="lk" href="#">Wholesale</a></li><li><a class="lk" href="#">Story</a></li></ul>
 <div class="navr"><a class="iconbtn" href="#" aria-label="Cart"><span data-ic="bag"></span></a><a class="btn btn-sm hide-m" href="#"><span data-ic="whatsapp"></span>Chat on WhatsApp</a><button class="iconbtn burger" data-burger aria-label="Menu" aria-expanded="false"><span class="b-open" data-ic="menu"></span><span class="b-close" data-ic="close"></span></button></div>
 <div class="mega" id="mega"><a class="mphoto" href="#"><img src="assets/img/lions-ladder.jpg" alt="Four crochet lions in sizes from small to extra large"><span class="mcap">Sizes S to XL</span></a>
  <div class="mcent">{eyebrow("SHOP")}<h2>Soft animals, made by hand in Nairobi</h2><p>Safari and farm friends in four sizes and many colourways. Ask for a price on WhatsApp.</p><a class="more" href="#">See all animals<span data-ic="arrow"></span></a></div>
  <ul class="mlist"><li><a href="#"><span data-ic="giraffe"></span><b>Safari animals</b><small>Giraffe, lion, elephant, zebra</small></a></li><li><a href="#"><span data-ic="rabbit"></span><b>Domestic animals</b><small>Rabbit, dog, cat</small></a></li><li><a href="#"><span data-ic="rhino"></span><b>More animals</b><small>Octopus, turtle, dinosaur</small></a></li><li><a href="#"><span data-ic="gift"></span><b>Gifts</b><small>Ready to wrap</small></a></li><li><a href="#"><span data-ic="hook"></span><b>Make it yours</b><small>Pick colours and size</small></a></li></ul></div>
</nav></header>
<div class="mobmenu" aria-label="Menu"><ul><li><a href="#"><b>Shop</b><span data-ic="chev"></span></a><div class="sub"><a href="#">Safari animals</a><a href="#">Domestic animals</a><a href="#">More animals</a></div></li><li><a href="#"><b>Gifts</b></a></li><li><a href="#"><b>Custom</b></a></li><li><a href="#"><b>Wholesale</b></a></li><li><a href="#"><b>Story</b></a></li></ul><a class="btn" href="#"><span data-ic="whatsapp"></span>Chat on WhatsApp</a></div>
<main>
<section class="hero"><div class="wrap hero-grid"><div class="hcopy">{eyebrow("HANDMADE IN KENYA")}<h1>Soft safari friends, crocheted by hand.</h1><p class="lead">Giraffes, lions, elephants and more. Recycled yarn, no plastic, stitched by 25+ women in Nairobi and safe for small hands.</p><div class="ctas"><a class="btn btn-lg" href="#"><span data-ic="whatsapp"></span>Ask for a price</a><a class="btn btn-ghost btn-lg" href="#">Shop animals<span data-ic="arrow"></span></a></div><ul class="facts"><li><span data-ic="hook"></span>Hand crocheted</li><li><span data-ic="truck"></span>Nairobi delivery</li><li><span data-ic="gift"></span>Gift ready</li></ul></div>{hero_art}</div></section>
<section class="sec" id="cats"><div class="wrap"><div class="shead">{eyebrow("COLLECTIONS")}<h2>Find your animal</h2></div>
<div class="bento"><a class="bt b-safari tilt" href="#"><img src="assets/img/elephant.jpg" alt="Slate blue crochet elephants"><div class="bl"><span data-ic="elephant"></span><b>Safari animals</b><small>Giraffe, lion, elephant, rhino, zebra</small></div></a>
<a class="bt b-dom tilt" href="#"><img src="assets/img/rabbit.jpg" alt="Brown crochet rabbit with a blue vest"><div class="bl"><span data-ic="rabbit"></span><b>Domestic</b></div></a>
<a class="bt b-gift tilt" href="#"><div class="bl"><span data-ic="gift"></span><b>Gifts</b><small>Ready to give</small></div></a>
<a class="bt b-cust tilt" href="#"><img src="assets/img/hands.jpg" alt="A maker crocheting a yellow giraffe"><div class="bl"><span data-ic="hook"></span><b>Make it yours</b></div></a>
<a class="bt b-whole tilt" href="#"><div class="bl"><span data-ic="truck"></span><b>Wholesale</b><small>Shops and lodges</small></div></a></div></div></section>
<section class="sec"><div class="wrap"><div class="shead row">{eyebrow("POPULAR")}<h2>Best friends to take home</h2><a class="more" href="#">All animals<span data-ic="arrow"></span></a></div><div class="pgrid">{cards}</div></div></section>
<section class="sec"><div class="wrap"><div class="shead">{eyebrow("HOW IT WORKS")}<h2>Three ways to take one home</h2></div><div class="tiers">
<article class="tier tilt"><span class="ti" data-ic="gift"></span>{eyebrow("01")}<h3>Ready to go</h3><p>Pick a finished animal in the size and colour you like. We pack it and deliver in Nairobi.</p><ul><li>Sizes S to XL</li><li>Gift wrap on request</li></ul><a class="more" href="#">Shop ready animals<span data-ic="arrow"></span></a></article>
<article class="tier tier-main tilt"><span class="ti" data-ic="hook"></span>{eyebrow("02")}<h3>Make it yours</h3><p>Choose body, mane and accent colours. A maker crochets it to your pick.</p><ul><li>Your colours</li><li>Preview on WhatsApp</li></ul><a class="btn" href="#">Start your design<span data-ic="arrow"></span></a></article>
<article class="tier tilt"><span class="ti" data-ic="truck"></span>{eyebrow("03")}<h3>For many</h3><p>Shops, lodges, schools and events. Trade pricing and repeat orders.</p><ul><li>Trade price list</li><li>Batch colours</li></ul><a class="more" href="#">Wholesale<span data-ic="arrow"></span></a></article></div></div></section>
<section class="sec"><div class="wrap"><div class="shead">{eyebrow("ICON SET")}<h2>Twelve brand icons</h2><p class="sub2">1.75px stroke, rounded joins, earth-tone duotone fill. Hover or tap to see each one move.</p></div><div class="isheet">{isheet}</div></div></section>
<section class="sec"><div class="wrap"><div class="shead">{eyebrow("TYPE")}<h2>Type specimen</h2></div><div class="spec"><div class="sp-d"><small class="eyebrow">DISPLAY / {'BRICOLAGE GROTESQUE' if A else 'UNBOUNDED'}</small><div class="big">Aa Giraffe</div><div class="mid">Soft safari friends, crocheted by hand.</div></div><div class="sp-b"><small class="eyebrow">BODY / {'GEIST' if A else 'INSTRUMENT SANS'}</small><p>Every animal is crocheted in recycled yarn and stuffed with soft fibre. Eyes are embroidered, never plastic, so they are safe for small hands. Delivery within Nairobi takes two to three days.</p><small class="eyebrow">MONO / {'GEIST MONO' if A else 'DM MONO'}</small><p class="mono">SIZE S M L XL   KES ASK ON WHATSAPP</p></div><ul class="scale"><li><i style="font:700 56px/1 Disp">56</i>Display XL</li><li><i style="font:700 40px/1 Disp">40</i>Display L</li><li><i style="font:600 28px/1 Disp">28</i>Display M</li><li><i style="font:500 20px/1 Body">20</i>Lead</li><li><i style="font:400 17px/1 Body">17</i>Body</li><li><i style="font:500 13px/1 Mono">13</i>Mono label</li></ul></div></div></section>
</main>
<footer class="foot"><div class="wrap">Mikono Creations, handmade crochet toys from Nairobi, Kenya. Design lab prototype.</div></footer>
<script src="icons.js"></script></body></html>'''
for d in "ab": open(f"{d}.html","w").write(page(d))
