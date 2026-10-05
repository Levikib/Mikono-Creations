import type { SVGProps } from "react";

/**
 * Icon set: 17 custom brand icons (24 grid, 1.75 stroke, round caps, one animated part each, drawn for this brand)
 * plus Phosphor (MIT, imported one file at a time so the bundle only carries what is used).
 * Custom icons play a short wobble on hover, focus and press of the button or link they sit in (see globals.css).
 */
const custom = {
  yarn: `<g class="duo"><circle cx="12" cy="12" r="8"/></g><g class="ln"><circle cx="12" cy="12" r="8"/><g class="m1"><path d="M5 9.2c4.6 2.2 9.4 2.2 14 0M4.6 13.6c5 2.4 10.2 2.4 14.8 0M9.4 4.4c-1.2 5.2 0 11 4 15.2"/></g><path d="M17.4 19.2c1.8 1 3.2.6 3.8-.8"/></g>`,
  hook: `<g class="duo"><circle cx="18" cy="17.5" r="3.2"/></g><g class="ln"><g class="m1"><path d="M4.5 19.5 15.5 8.5"/><path d="M15.5 8.5c-1.3-1.5-.9-3.3.7-4.1 1.7-.8 3.5.1 3.7 1.7.1.9-.4 1.6-1.1 2"/></g><path d="M14.5 18c1.4 1.4 3.4 1.9 5 .9"/></g>`,
  hands: `<g class="duo"><path class="m1" d="M12 5.4c-.9-1.5-3.6-1.4-3.6.8 0 1.7 2 2.8 3.6 4.1 1.6-1.3 3.6-2.4 3.6-4.1 0-2.2-2.7-2.3-3.6-.8z"/></g><g class="ln"><path class="m1" d="M12 5.4c-.9-1.5-3.6-1.4-3.6.8 0 1.7 2 2.8 3.6 4.1 1.6-1.3 3.6-2.4 3.6-4.1 0-2.2-2.7-2.3-3.6-.8z"/><path d="M3 14.5h2.8l3.2 2.2h4.6c1.1 0 1.6 1.3.7 1.9L11 20.6H5.8L3 19.2z"/><path d="M13.6 16.7 18 15.3c1.3-.4 2.5.9 1.7 2L15.5 21"/></g>`,
  giraffe: `<g class="duo"><rect x="7" y="6.2" width="9.5" height="4.3" rx="2.1"/></g><g class="ln"><g class="m1"><path d="M9.5 3.6v2.6M13.5 3.6v2.6"/><rect x="7" y="6.2" width="9.5" height="4.3" rx="2.1"/><path d="M10 10.5V21M14.5 10.5V21"/></g><circle cx="12.25" cy="14" r=".7" class="dot"/><circle cx="12.25" cy="18" r=".7" class="dot"/><circle cx="14.4" cy="7.9" r=".5" class="dot"/></g>`,
  elephant: `<g class="duo"><circle cx="8.6" cy="11" r="4.8"/></g><g class="ln"><circle cx="8.6" cy="11" r="4.8"/><g class="m1"><path d="M12.4 7.2c3.6-.6 6.2 1.5 6.2 4.8v5.2c0 1.8-2.4 1.8-2.4 0v-3.3"/></g><path d="M14.7 15.4c.2 1.6 1.1 2.8 2.6 3.2"/><circle cx="13.6" cy="10" r=".7" class="dot"/><path d="M4 18.8h8.4"/></g>`,
  lion: `<g class="duo"><circle cx="12" cy="12" r="8.6"/></g><g class="ln"><g class="m1"><path d="M12 3.4l1.8 1.7 2.4-.4.8 2.3 2.2 1-.2 2.4 1.6 1.8-1.6 1.8.2 2.4-2.2 1-.8 2.3-2.4-.4L12 20.6l-1.8-1.7-2.4.4-.8-2.3-2.2-1 .2-2.4L3.4 12l1.6-1.8-.2-2.4 2.2-1 .8-2.3 2.4.4z"/></g><circle cx="12" cy="12.3" r="4"/><circle cx="10.5" cy="11.3" r=".6" class="dot"/><circle cx="13.5" cy="11.3" r=".6" class="dot"/><path d="M11 13.5h2l-1 1z"/></g>`,
  rhino: `<g class="duo"><path d="M3.5 15.5V12l4-2.8h8.3a4.2 4.2 0 0 1 4.2 4.2v2.1z"/></g><g class="ln"><path d="M3.5 15.5V12l4-2.8h8.3a4.2 4.2 0 0 1 4.2 4.2v4.1H3.5z"/><g class="m1"><path d="M6.2 10.3 4.2 6.4l3.3 2.8"/></g><path d="M7 17.5v2.6M16.5 17.5v2.6"/><circle cx="9.8" cy="12" r=".7" class="dot"/><path d="M13 9.3l.5-1.8 1.6 1.9"/></g>`,
  zebra: `<g class="duo"><path d="M8 4.6 10.5 7l4.2 1.7c2.3 1 3.5 3.1 3.5 5.8V20H9v-5.2"/></g><g class="ln"><g class="m1"><path d="M8 4.6 10.5 7l4.2 1.7c2.3 1 3.5 3.1 3.5 5.8V20H9v-5.2L6.3 12.5 7 8.8z"/></g><path d="M12.4 9.8l2.6 3M13.6 7.9l3.4 3.6M10.7 12.7l3.4 3.3M12 17h3.9M18.2 17.8"/><circle cx="9.2" cy="8.7" r=".6" class="dot"/></g>`,
  rabbit: `<g class="duo"><circle cx="12" cy="14.8" r="5.2"/></g><g class="ln"><g class="m1"><path d="M9.3 10.3C7.7 6 8 3 9.5 3s2.2 3 2 7.3M14.7 10.3c1.6-4.3 1.3-7.3-.2-7.3s-2.2 3-2 7.3"/></g><circle cx="12" cy="14.8" r="5.2"/><circle cx="10.2" cy="14" r=".6" class="dot"/><circle cx="13.8" cy="14" r=".6" class="dot"/><path d="M11 16.3l1 .8 1-.8"/></g>`,
  gift: `<g class="duo"><rect x="4" y="10.5" width="16" height="9.5" rx="2"/></g><g class="ln"><rect x="4" y="10.5" width="16" height="9.5" rx="2"/><g class="m1"><rect x="3" y="7" width="18" height="3.5" rx="1.4"/><path d="M12 7C10 3.5 6.8 4 7.5 6c.4 1 2.5 1 4.5 1zM12 7c2-3.5 5.2-3 4.5-1-.4 1-2.5 1-4.5 1z"/></g><path d="M12 10.5V20"/></g>`,
  truck: `<g class="duo"><rect x="2.5" y="6" width="11" height="10" rx="2"/></g><g class="ln"><g class="m1"><rect x="2.5" y="6" width="11" height="10" rx="2"/><path d="M13.5 9.5h4l3 3.3V16h-7"/></g><circle class="m2" cx="7" cy="17.5" r="2"/><circle class="m2" cx="17" cy="17.5" r="2"/></g>`,
  whatsapp: `<g class="duo"><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.6 20.4l4.2-1.1A8.5 8.5 0 1 0 12 3.5z"/></g><g class="ln"><g class="m1"><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.6 20.4l4.2-1.1A8.5 8.5 0 1 0 12 3.5z"/></g><path d="M9.2 8.6c-.5.6-.7 1.5-.1 2.7a8.2 8.2 0 0 0 3.6 3.5c1.1.5 1.9.3 2.5-.3l.3-.7-1.8-1-.8.6c-.8-.4-1.6-1.1-2.1-2l.6-.8-.9-1.8z"/></g>`,
  arrow: `<g class="ln"><g class="m1"><path d="M5 12h14M13 6l6 6-6 6"/></g></g>`,
  chevron: `<g class="ln"><path d="M6 9l6 6 6-6"/></g>`,
  bag: `<g class="duo"><path d="M5 8h14l-1 12H6z"/></g><g class="ln"><path d="M5 8h14l-1 12H6z"/><g class="m1"><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></g></g>`,
  menu: `<g class="ln"><path d="M4 9h16M4 15h16"/></g>`,
  close: `<g class="ln"><path d="M6 6l12 12M18 6 6 18"/></g>`,
} as const;

const PH = new Set(["shield", "leaf", "heart", "pin", "phone", "info", "check", "instagram", "facebook", "recycle", "store", "ruler", "sparkle", "back", "people", "camera", "book", "sliders", "package"]);
const PH_FILL = new Set(["shield", "leaf", "heart", "pin", "phone", "info", "instagram", "facebook", "recycle", "store", "ruler", "sparkle", "back", "people", "camera", "book", "sliders", "package"]);

// Old names keep working: cart is the bag, hand is the hands icon.
const alias: Record<string, keyof typeof custom> = { cart: "bag", hand: "hands", chev: "chevron" };

export type IconName = keyof typeof custom | "shield" | "leaf" | "heart" | "pin" | "phone" | "info" | "check" | "instagram" | "facebook" | "recycle" | "store" | "ruler" | "sparkle" | "back" | "people" | "camera" | "book" | "sliders" | "package" | keyof typeof alias;
export const iconNames = [...Object.keys(custom), ...PH, ...Object.keys(alias)] as IconName[];
export const customIconNames = Object.keys(custom) as (keyof typeof custom)[];

type Props = Omit<SVGProps<SVGSVGElement>, "name"> & { name: IconName; size?: number; label?: string; duo?: boolean };

export function Icon({ name, size = 24, label, duo = false, className, ...rest }: Props) {
  const key = (alias[name] ?? name) as string;
  const markup = (custom as Record<string, string>)[key];
  if (markup) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} data-duo={duo ? "1" : "0"} className={className ? `mk-ic ${className}` : "mk-ic"}
        role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false" {...rest}
        dangerouslySetInnerHTML={{ __html: markup }} />
    );
  }
  if (!PH.has(key)) return null;
  // Phosphor icons are drawn from the sprite in the layout (components/IconSprite.tsx), so no icon data is shipped as script.
  return (
    <svg viewBox="0 0 256 256" width={size} height={size} fill="currentColor" className={className ? `mk-ph ${className}` : "mk-ph"}
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      {duo && PH_FILL.has(key) ? <use href={`#ph-${key}-f`} /> : null}
      <use href={`#ph-${key}`} />
    </svg>
  );
}
