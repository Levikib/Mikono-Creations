/** Plain line drawings of the comparison objects. They help you picture the steps. They are not to scale. */
export function CompareObject({ object, size = 44 }: { object: "hand" | "cushion" | "cushion-big" | "backpack"; size?: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
      <g {...common}>
        {object === "hand" ? (
          <>
            <rect x="17" y="9" width="7" height="27" rx="3.5" /><rect x="26" y="5" width="7" height="31" rx="3.5" />
            <rect x="35" y="7" width="7" height="29" rx="3.5" /><rect x="44" y="13" width="7" height="23" rx="3.5" />
            <path d="M17 30v13a14 14 0 0 0 14 14h6a14 14 0 0 0 14-14V30" />
            <rect x="6" y="31" width="7" height="20" rx="3.5" transform="rotate(-28 9.5 41)" />
          </>
        ) : null}
        {object === "cushion" ? (
          <>
            <rect x="10" y="16" width="44" height="34" rx="9" /><path d="M10 16 6 12M54 16l4-4M10 50l-4 4M54 50l4 4" /><circle cx="32" cy="33" r="2.4" />
          </>
        ) : null}
        {object === "cushion-big" ? (
          <>
            <rect x="6" y="10" width="52" height="44" rx="11" /><path d="M6 10 3 7M58 10l3-3M6 54l-3 3M58 54l3 3" /><circle cx="32" cy="32" r="2.6" /><path d="M32 12v14M32 38v14" />
          </>
        ) : null}
        {object === "backpack" ? (
          <>
            <path d="M25 15v-4a7 7 0 0 1 14 0v4" /><rect x="14" y="14" width="36" height="44" rx="12" />
            <rect x="21" y="37" width="22" height="15" rx="5" /><path d="M14 26h-3.5v20H14M50 26h3.5v20H50" />
          </>
        ) : null}
      </g>
    </svg>
  );
}
