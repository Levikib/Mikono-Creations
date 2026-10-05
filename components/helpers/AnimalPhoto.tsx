import Image from "@/components/Img";
import { cx } from "@/lib/cx";
import type { HelperImage } from "@/lib/helpers/types";

/** Real catalogue photo in a square frame. Never tinted or filtered. White background cutouts blend into the frame. */
export function AnimalPhoto({ image, sizes, eager, className, alt }: { image: HelperImage; sizes: string; eager?: boolean; className?: string; alt?: string }) {
  return (
    <div className={cx("mkh-media aspect-square w-full", className)}>
      <Image src={image.src} alt={alt ?? image.alt} fill sizes={sizes} loading={eager ? "eager" : undefined}
        className={cx("object-cover", image.multiply && "mix-blend-multiply")}
        style={{ objectPosition: `${image.focal[0] * 100}% ${image.focal[1] * 100}%` }} />
    </div>
  );
}
