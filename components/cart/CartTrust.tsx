import { Icon } from "../Icon";
import { trustClaims } from "@/data/copy";

/** Approved claims only (D26, D27): the same four items as the home trust strip, as one slim row. */
export function CartTrust() {
  const items = [
    ...trustClaims.map((c) => ({ icon: c.icon, title: c.title })),
    { icon: "heart" as const, title: "25+ women supported" },
  ];
  return (
    <section aria-label="Why people trust Mikono" className="rounded-[var(--radius-card)] bg-oat px-3 py-2 shadow-clay-sm">
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4">
        {items.map((i) => (
          <li key={i.title} className="flex items-center gap-1.5 text-[.8125rem] font-semibold text-baobab">
            <Icon name={i.icon} size={18} className="shrink-0 text-terracotta-deep" />{i.title}
          </li>
        ))}
      </ul>
      <p className="mt-1 text-[.75rem] text-stone">Zero plastic and nothing detachable describe our plain crocheted animals.</p>
    </section>
  );
}
