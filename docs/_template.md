# <Page name>

<One paragraph: what the page is for and what a reader does on it.>

## Route

- **URL:** `/<path>/:param` (`AppRoutes.<Name>` in [`AppRoutes.ts`](../../src/helper/AppRoutes.ts)).
- **Reached from:** <nav link, breadcrumb, links on other pages, shortcuts>.
- **Breadcrumb:** <Home › Page>.
- <Redirects, keyed remounts, or URL params the page reads.>

## Files

| File                                                                                | What it is                        |
| ----------------------------------------------------------------------------------- | --------------------------------- |
| [`<Page>.tsx`](../../src/components/pages/<Page>.tsx)                               | The page: fetching, state, layout |
| [`<child>.tsx`](../../src/components/<folder>/<child>.tsx)                          | <one line>                        |
| [`<page>.css`](../../src/css/main-pages/<page>.css)                                 | Styles                            |
| [`__tests__/<Page>.test.tsx`](../../src/components/pages/__tests__/<Page>.test.tsx) | <what it covers>                  |

## Data

<Endpoints (from `DownstreamServices.ts`), when each is called, timeouts, caching, cancellation, and what a failure does.>

## State and going back

<What's kept per history entry (`useHistoryEntry*` names and their `isSettled`), what's in `localStorage`, and which fetches a restored page skips.>

## Layout and behaviour

<Desktop first, then phones (below which breakpoint or container width), then anything interactive: keyboard, popups, live updates.>

## Accessibility

<Landmarks and headings, labels, live regions, keyboard support, anything hidden from or added for screen readers.>

## Tests

<What the tests cover, and the mocks they need (`skc-rcl`, `react-markdown`, `@dnd-kit/react`, `matchMedia`).>

## Design history

<Mockup canvas and the option that was picked, if there is one.>

## Known issues

<Page-specific open items and follow-ups.>
