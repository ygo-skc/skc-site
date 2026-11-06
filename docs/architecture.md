# Architecture

How the site is put together: where a request goes from the URL to the screen, how pages keep their place when the reader goes back, where data comes from, and how styling and tests are set up. The rules every page follows are in [`CLAUDE.md`](../CLAUDE.md#ui-rules).

## Source layout

| Folder                                              | What's in it                                                                                                                            |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [`src/components/pages/`](../src/components/pages/) | One component per route, plus [`Routes.tsx`](../src/components/pages/Routes.tsx) and [`Layout.tsx`](../src/components/pages/Layout.tsx) |
| `src/components/<feature>/`                         | A page's pieces: `banlist/`, `card/`, `product/`, `tier-list/`, `pull-cost/`, `about/`, `home/`, `header-footer/`                       |
| [`src/components/util/`](../src/components/util/)   | Pieces used on more than one page - search, Trending, upcoming products, social, `useHistoryEntry`                                      |
| [`src/helper/`](../src/helper/)                     | Plain functions and constants - routes, endpoints, fetching, dates, ban statuses, `localStorage` helpers                                |
| [`src/reducers/`](../src/reducers/)                 | Reducers for pages that load several things at once                                                                                     |
| [`src/css/`](../src/css/)                           | Plain CSS, imported by the component that uses it - `main-pages/`, `header-footer/`, `card/`, `util/`                                   |
| [`src/index.css`](../src/index.css)                 | The `:root` palette, `--card-thumb`, and shared classes (`.visually-hidden`, `.card-frame-ring`, `.hairline-edge`)                      |

Tests sit next to the code in `__tests__/` folders.

## From URL to screen

[`index.tsx`](../src/index.tsx) wraps the app in the MUI theme and hands the route config from [`Routes.tsx`](../src/components/pages/Routes.tsx) to `createBrowserRouter`. Routes are a config object, not JSX, so the app runs on react-router's data router - `ScrollRestoration` needs it. Paths live in the [`AppRoutes`](../src/helper/AppRoutes.ts) enum.

Every page is `lazy()` loaded, so each is its own bundle chunk. Larger pages lazy load their sections too (the ban list's header, What changed and full list), each behind a `Suspense` skeleton the size of the loaded section.

Every route renders inside [`Layout`](../src/components/pages/Layout.tsx), which provides, in order:

1. `ResultsViewProvider` - the reader's List / Grid default from Settings ([`ResultsViewPreference.tsx`](../src/components/util/ResultsViewPreference.tsx)).
2. `SiteSearchProvider` - the search popup, openable from anywhere ([`SiteSearch.tsx`](../src/components/util/search/SiteSearch.tsx)).
3. `ScrollRestoration`.
4. The nav bar, the page (`<Outlet />` in a `Suspense`), and the footer.
5. `useGoToShortcuts()` - the `g` then a letter shortcuts.

Card and product pages are wrapped in `KeyedCardInformation` / `KeyedProductInformation`, which key the page by its id. Going from card A to card B stays on the same route, and without the key React would keep card A's state; the key remounts the page. [`Routes.remount.test.tsx`](../src/components/pages/__tests__/Routes.remount.test.tsx) guards this.

Pages set their own `<title>` and `<meta>` tags in JSX - React 19 hoists them into `<head>`.

## Going back picks up where the reader left off

Going back to a page must show it exactly as it was left - same scroll position, data, filters and "Show more" counts, with no refetch or skeletons. This is the site's top behavioural priority; the full rules are in [`CLAUDE.md`](../CLAUDE.md#ui-rules).

The mechanism is [`useHistoryEntry.ts`](../src/components/util/useHistoryEntry.ts). It keeps values in memory per history entry - react-router's `location.key` plus a name - so they last until the tab reloads (the 50 most recent entries). A new visit to the same URL is a new entry, so it loads fresh.

| Hook                                                        | Use it for                                                                                                                                                                           |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `useHistoryEntryState(name, initial, isSettled?)`           | A `useState` that comes back as it was left                                                                                                                                          |
| `useHistoryEntryReducer(name, reducer, initial, isSettled)` | The same for a `useReducer`                                                                                                                                                          |
| `useHistoryEntry(name)`                                     | The raw `[saved, remember, hasSaved]`, for pages that save one snapshot of several pieces that must match - the ban list and Card Browse keep criteria and results together this way |

Each hook's third value says whether the state was restored. A restored page **skips its mount's fetches**, since it already has what they'd load. That's why only settled state is kept: `isSettled` (defined at module level, so it's stable) returns false while anything is still loading, and a half-loaded page is never saved - it would come back with skeletons and nothing fetching.

Two things make the restore land on the right spot:

- `ScrollRestoration` scrolls right after the first render, so that render must be full height. Build lists during render (`useMemo`), not in an effect, and reserve image space with `aspect-ratio`.
- Don't `navigate(..., { replace: true })` to the URL the page is already on. A replace gives the entry a new key and the saved position is lost - the ban list only replaces when the path actually differs.

## Fetching

Endpoints live in [`DownstreamServices.ts`](../src/helper/DownstreamServices.ts), one object per service: `SKC_API_ENDPOINTS`, `SKC_SUGGESTION_ENDPOINTS` and `HEART_API_ENDPOINTS`. Each service's host comes from [`.env-cmdrc.json`](../.env-cmdrc.json) for the build's environment (`dev`, `remote-dev`, `prod`), injected by webpack's `DefinePlugin`.

Calls go through [`FetchHandler.handleFetch`](../src/helper/FetchHandler.ts) (axios):

- It sends the site's `CLIENT_ID` header and times out after 6s (`DEFAULT_TIMEOUT`); the 5th argument sets another timeout (Card Browse's every-card answer gets 10s).
- On failure it redirects to an error page - 503 for a network error, 408 for a timeout, 404 / 400 / 500 from the response - with `location.replace`, so the error page takes the failing page's place in history. Pushing it would trap the reader: back would reload the failing page, which fails and pushes the error page again.
- Passing `useDefaultErrorHandler = false` returns the promise so the page can handle errors in place (Card Browse says "Couldn't load cards" in its count line).
- Pages pass an axios `CancelToken` and a local `isCurrent` flag, so a newer request cancels the old one and a stale answer is ignored.

Discord's public widget is read with plain `fetch` - the `CLIENT_ID` header fails Discord's CORS preflight.

## Styling

- **Theme:** [`MuiTheme.ts`](../src/components/MuiTheme.ts) sets the type scale (apple's, in rem off the browser's 16px), palette and component defaults. Breakpoints are MUI's defaults - `sm` 600px, `md` 900px, `lg` 1200px - so "phones" in these docs means below `sm` unless a page says otherwise. Ask before changing the theme; [`MuiTheme.test.ts`](../src/components/__tests__/MuiTheme.test.ts) guards it.
- **Palette:** colours are custom properties on `:root` in [`index.css`](../src/index.css) (`--page`, `--capsule*`, `--accent`, `--accent-text`, the ban statuses...). Use the variables, and derive tints with `color-mix()`.
- **Component CSS:** each component imports its own plain CSS file with BEM-ish class names. Text sizes come from the Typography variant, never from CSS. Override MUI and skc-rcl styles with a doubled class (`.ban-list-cards__filter.MuiChip-root`), not `!important` - rcl injects its CSS at runtime, so stylesheet order can't be relied on.
- **skc-rcl:** card UI (`YGOCardPreview`, `YGOCardWithImage`, `CardImageRounded`, `DateBadge`, `Section`) comes from rcl, and card frame colours are rcl's exactly. The site themes rcl through its `--<component>-*` custom properties; rcl itself never gets the site's palette.

## Testing

Jest 30 with Testing Library, configured in [`package.json`](../package.json):

- [`config/jest/jsdomWithFetchEnvironment.js`](../config/jest/jsdomWithFetchEnvironment.js) adds node's Fetch API globals to jsdom - the data router builds a `Request` for every navigation.
- [`setupTests.ts`](../src/setupTests.ts) adds jest-dom matchers, a `window.location` mock, `TextEncoder`, a no-op `ResizeObserver`, and clears remembered history entries before each test (every test's router starts on the same `default` key).
- CSS imports are stubbed ([`styleMock.js`](../config/jest/styleMock.js)).
- ESM-only packages don't load under Jest: mock `skc-rcl`, `react-markdown` and `@dnd-kit/react` in tests that render them. The full list of test gotchas is in [`CLAUDE.md`](../CLAUDE.md#testing-notes).

Coverage thresholds are 80% lines / functions / statements and 70% branches.
