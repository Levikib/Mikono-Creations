import Image from "@/components/Img";
import { cx } from "@/lib/cx";

/** Renders a supplied photo crop or true sampled hex. Never clamps colour (D30). */
export function ColourSwatch({ name, hex, imageSrc, selected, showName = true }: {
  name: string; hex?: string; imageSrc?: string; selected?: boolean; showName?: boolean;
}) {
  return (
    <span className="inline-flex min-h-11 items-center gap-2">
      <span className={cx("relative inline-block size-7 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-bone", selected ? "ring-baobab" : "ring-sand-deep")}>
        {imageSrc ? (
          <Image src={imageSrc} alt="" fill sizes="28px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 bg-sand" style={hex ? { backgroundColor: hex } : undefined} />
        )}
      </span>
      {showName ? <span className="text-base font-semibold">{name}</span> : <span className="sr-only">{name}</span>}
    </span>
  );
}
