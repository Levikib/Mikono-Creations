/** Three tiny inline icons, so the filter components never pull in the full icon set as script. */
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: "false", viewBox: "0 0 24 24" } as const;
export const Chev = ({ size = 18 }: { size?: number }) => <svg {...base} width={size} height={size}><path d="M6 9l6 6 6-6" /></svg>;
export const Cross = ({ size = 18 }: { size?: number }) => <svg {...base} width={size} height={size}><path d="M6 6l12 12M18 6 6 18" /></svg>;
/** Phosphor "sliders" from the sprite in the layout. */
export const Sliders = ({ size = 18 }: { size?: number }) => <svg viewBox="0 0 256 256" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false"><use href="#ph-sliders" /></svg>;
