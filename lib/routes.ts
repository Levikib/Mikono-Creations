// Every public route this build adds, for the sitemap. The engineering agent can import `contentRoutes`.
import { posts } from "@/content/journal";
import { projects } from "@/content/projects";

/** Static routes for story, trade, help and legal pages. */
export const pageRoutes = [
  "/gifts", "/story", "/impact", "/makers", "/journal", "/projects", "/gallery",
  "/care", "/size-guide", "/safety", "/faq", "/delivery",
  "/partners", "/supply", "/custom", "/stockists",
  "/privacy", "/cookies", "/terms", "/terms/custom", "/terms/wholesale", "/terms/website", "/returns", "/safety-notice",
  "/accessibility", "/complaints", "/data-request", "/legal", "/legal/ip", "/legal/marketing",
] as const;

export const journalRoutes = (): string[] => posts.map((p) => `/journal/${p.slug}`);
export const projectRoutes = (): string[] => projects.map((p) => `/projects/${p.slug}`);

/** All routes from this build, ready for sitemap entries. */
export function contentRoutes(): string[] {
  return [...pageRoutes, ...journalRoutes(), ...projectRoutes()];
}
