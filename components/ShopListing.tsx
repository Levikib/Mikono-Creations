import Link from "next/link";
import { Breadcrumb } from "./Breadcrumb";
import { Container } from "./Container";
import { FxPage } from "./fx/FxPage";
import { Band } from "./fx/Band";
import { ShopFilters, type FilterData } from "./ShopFilters";
import { DensityToggle } from "./card/DensityToggle";
import { ProductCard } from "./ProductCard";
import { colourFamilies } from "@/data/colours";
import { sizeWord } from "@/lib/sizes";
import { sizeClasses, WALL_SIZE } from "@/data/facts";
import { allProducts, categories, speciesLabel, type Category } from "@/lib/catalogue";
import { toCard } from "@/lib/cards";
import { variantPath } from "@/lib/imageLoader";

/**
 * Statically rendered listing. The server renders the heading, the category row and the whole grid once; the small client part
 * (ShopFilters) reads the URL and hides or shows the list items that are already in the page, so the first view is never re-rendered
 * and a filtered URL never reaches a function. Each item carries its colour photos so a colour filter can swap the picture.
 */
/** Colour families in everyday words (the data labels stay as they are for the Studio). */
const colourWords: Record<string, string> = {
  neutral: "Cream, white, grey and black", brown: "Brown and tan", yellow: "Yellow and orange", red: "Red and pink", green: "Green", blue: "Blue and purple", multi: "Many colours",
};

export function ShopListing({ category }: { category?: Category }) {
  const scope = category ? allProducts().filter((p) => p.category === category.key) : allProducts();
  const base = category ? `/shop/${category.slug}` : "/shop";
  const rows = scope.map((p) => {
    const colours = p.colourAsk ? [] : [...new Set(p.colourways.map((c) => c.family))];
    const cimg: Record<string, string> = {};
    const baseImg = toCard(p).image?.src;
    for (const f of colours) {
      const cw = p.colourways.find((c) => c.family === f);
      const src = cw ? toCard(p, cw.key).image?.src : undefined;
      if (src && src !== baseImg) cimg[f] = variantPath(src, 320);
    }
    return { p, colours, cimg, card: toCard(p) };
  });
  const nav = [{ label: "Everything", href: "/shop", n: allProducts().length, on: !category },
    ...categories.map((c) => ({ label: c.label, href: `/shop/${c.slug}`, n: allProducts().filter((p) => p.category === c.key).length, on: category?.key === c.key }))];
  const data: FilterData = {
    base,
    unitPieces: !!category && (category.key === "wall-art" || category.key === "dolls"),
    species: [...new Set(scope.map((p) => p.species))].map((k) => ({ key: k, label: speciesLabel(k) })),
    colours: colourFamilies.filter((cf) => scope.some((p) => !p.colourAsk && p.colourways.some((c) => c.family === cf.key))).map((c) => ({ key: c.key, label: colourWords[c.key] ?? c.label })),
    sizes: [...sizeClasses, WALL_SIZE].filter((s) => scope.some((p) => (p.sizes as readonly string[]).includes(s))).map((s) => ({ key: s, label: sizeWord(s) })),
    sizesDiffer: new Set(scope.map((p) => p.sizes.join())).size > 1,
    items: rows.map((r) => ({ name: r.p.name, species: r.p.species, colours: r.colours, sizes: [...r.p.sizes], several: !r.p.colourAsk && r.p.colourways.length > 1, from: r.p.priceKes })),
  };
  const heading = category ? category.label : "Crocheted animals";
  const lede = category ? category.blurb : "Every animal is crocheted by hand in Nairobi from recycled acrylic yarn. Choose an animal, then a colour and a size.";

  return (
    <FxPage t="shop">
    <Container className="pb-4 pt-0 md:pb-6 md:pt-1">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: category ? "/shop" : undefined }, ...(category ? [{ label: category.label }] : [])]} />
      <div className="max-w-[62ch]">
        <h1 className="text-display-lg">{heading}</h1>
        <p className="mt-1 text-base text-stone">{lede}</p>
      </div>
      <Band t="shop" id="top" nested />
      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-base text-stone">
        <span>Not sure?</span>
        <Link prefetch={false} href="/gifts/finder?src=shop" data-track="shop_gift_finder" className="hit-y inline-flex min-h-8 items-center font-semibold text-terracotta-deep underline underline-offset-4">Gift finder</Link>
        <Link prefetch={false} href="/size-finder?src=shop" data-track="shop_size_finder" className="hit-y inline-flex min-h-8 items-center font-semibold text-terracotta-deep underline underline-offset-4">Find your size</Link>
      </p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p id="shop-groups" className="mf-label">Shop by group</p>
        <div className="flex items-center gap-2 md:hidden"><span className="text-[.8125rem] text-stone">Grid size</span><DensityToggle /></div>
      </div>
      <nav aria-labelledby="shop-groups" className="mt-1">
        <ul className="mf-chips">
          {nav.map((c) => (
            <li key={c.href}>
              <Link href={c.href} aria-current={c.on ? "page" : undefined} className="mf-chip">{c.label}<span className="mf-n">{c.n}</span></Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-2">
        <ShopFilters data={data}>
          <div id="products" className="min-w-0 scroll-mt-24">
            <h2 className="sr-only">{category ? category.label : "All pieces"}</h2>
            <div id="shop-grid-wrap" className="mt-1">
              <ul data-card-group className="mk-grid mk-grid--shop">
                {rows.map((r, i) => (
                  <li key={r.p.slug} data-item data-cimg={Object.keys(r.cimg).length ? JSON.stringify(r.cimg) : undefined}>
                    <ProductCard item={r.card} eager={i < 3} />
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-center text-base text-stone">
                Cannot find your animal?{" "}
                <Link prefetch={false} href="/custom/studio?type=new_animal&src=shop" data-track="shop_studio" className="hit-y inline-flex min-h-8 items-center font-semibold text-terracotta-deep underline underline-offset-4">Tell us about it</Link>
              </p>
            </div>
          </div>
        </ShopFilters>
      </div>
      <Band t="shop" id="end" nested />
    </Container>
    </FxPage>
  );
}
