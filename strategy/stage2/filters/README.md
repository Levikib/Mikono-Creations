# Shared filters, tabs and in-page navigation

One pattern, one folder: `components/filters/` (styles in `filters.css`, prefix `mf-`). Every page that filters, searches, tabs or lists contents uses it, so a first-time visitor on a cheap phone sees the same thing everywhere.

## Parts
| Component | Use |
|---|---|
| `FilterBar` + `SortSelect` | Slim sticky bar: search, big Filters button with a count badge (phones and tablets only), result count, Sort. |
| `SearchBox` | Instant client search, 16 px text, clear button. Label is also the placeholder ("Find an animal by name"). |
| `ChipGroup` | A labelled group of wrapping chips with counts, `aria-pressed` and a tick mark. `limit` adds "Show all N". Never scrolls sideways. |
| `RowGroup` | The same group as big 44 px tap rows with a checkbox (colour lists). |
| `FilterSection` | Collapsible group, the title is the button; closed it says the choice in words ("Giraffe, Lion"). |
| `FilterSheet` | Bottom sheet on a native dialog: grabber, close X, Escape, focus trap, scroll lock, Clear all, big "Show 12 animals" button. |
| `ActiveFilters` | Removable chips ("Colour: Yellow x"), Clear all only when something is on. |
| `ResultCount` | `role=status` live text: "Showing 12 of 30 animals". |
| `EmptyResults` | Says why nothing matches, "Remove Colour: Blue" and "Show everything". |
| `Tabs` | Real tablist with counts, arrows, Home and End; wraps. Panel ids from `tabId` and `panelId`. |
| `SubNav` | "On this page": closed named button on phones, sticky list from 1024 px, highlights the current section. `only="m"` or `"d"` places each half. |
| `url.ts` | `useQueryString`, `writeQuery`, `only`: state lives in the address bar (Back and sharing work). |

## Where it is used
- `/shop` and the five category pages (`ShopFilters`): type of animal, colour (plain words), size (only where it varies), "comes in several colours", sort Featured or A to Z, search by name. Desktop: sticky 260 px sidebar with the same groups open. Quick chips "Shop by group" above wrap onto lines. Filters the server rendered grid, so the page stays static.
- `/journal` (`JournalIndex`): Find a post, topic chips with counts, "Showing 12 of 47 posts", Show more kept.
- `/gallery`: Tabs with counts plus All.
- `/faq` (`FaqFilter`): Find a question, topic chips; the list is server rendered and only hidden or shown.
- Legal pages and blog posts: `SubNav`.

## Rules for a new page
1. Visible group labels in everyday words; every chip shows its count; say in words what is shown.
2. Wrap, never scroll sideways. 36 px chips with a 44 px hit area, 8 px apart.
3. State in the URL through `writeQuery`. Filtered URLs get `X-Robots-Tag: noindex, follow` in `next.config.ts` (add the query keys there).
4. Always offer Clear all (only when active) and an empty state.
5. Add the page to scenario S9 in `scripts/mobile-qa/interactions.mjs`.

## Screenshots (`shots/`)
Before: `before-shop-390.png` (category row cut off at the edge, unexplained Filters), `before-shop-1440.png`, `before-gallery-390.png` (tabs cut off), `before-legal-390.png`, `before-journal-390.png`, `before-faq-390.png`.
After: `after-shop-390.png`, `after-sheet-390.png`, `after-sheet-picked-390.png`, `after-shop-1440.png`, `after-empty-320.png`, `after-journal-390.png`, `after-gallery-390.png`, `after-faq-390.png`, `after-legal-390.png`.
