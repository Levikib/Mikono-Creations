import { Container } from "./Container";
import { CardGrid, StatCard } from "./card/Card";

export type Stat = { value: string; label: string };

/** Renders only confirmed figures. No figures hides the band; one figure uses a single centred card (D27). Stat cards live in their own row. */
export function StatsBand({ stats }: { stats: readonly Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="py-3 md:py-4">
      <Container>
        {stats.length === 1 ? (
          <div className="mx-auto max-w-[240px]"><StatCard tone="baobab" big={stats[0].value} title={stats[0].label} /></div>
        ) : (
          <CardGrid kind="four">{stats.map((s) => <StatCard key={s.label} tone="baobab" big={s.value} title={s.label} />)}</CardGrid>
        )}
      </Container>
    </div>
  );
}
