# Ban list

Shows one ban list for a format (TCG or Master Duel): which cards are Forbidden, Limited and Semi-Limited, how many of each, and what changed since the list before it. Readers pick the format and the list's date, browse the full list, and open any card.

## Route

- **URL:** `/ban_list` and `/ban_list/:specifiedFormat` (`AppRoutes.BanList`), e.g. `/ban_list/TCG`, `/ban_list/MD`.
- **Reached from:** the nav's Ban List link, the `g` `b` shortcut, and the search popup's Jump to pills.
- **Breadcrumb:** Home › Ban List.
- The format is read case-insensitively; anything unknown opens TCG ([`getValidFormat`](../../src/helper/BanListUtil.ts)). Duel Links isn't supported anymore, so `/ban_list/DL` opens TCG too.
- The page keeps the URL in step with the format through the router (`navigate(..., { replace: true })`), only when the path differs - `/ban_list` becomes `/ban_list/TCG`, and switching to Master Duel becomes `/ban_list/MD`. The list's date isn't in the URL.

## Files

| File                                                                                                                                           | What it is                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`BanList.tsx`](../../src/components/pages/BanList.tsx)                                                                                        | The page: format, dates and list fetching, the history snapshot, and the data each section gets                                                     |
| [`BanListHeader.tsx`](../../src/components/banlist/BanListHeader.tsx)                                                                          | White header card: date badge, eyebrow, h1, list count or "Takes effect in N days", controls, and the totals                                        |
| [`BanListFormat.tsx`](../../src/components/banlist/BanListFormat.tsx)                                                                          | TCG / Master Duel segmented control                                                                                                                 |
| [`BanListDates.tsx`](../../src/components/banlist/BanListDates.tsx)                                                                            | The date pill - a `Select` grouped by year, newest first                                                                                            |
| [`BanListDonut.tsx`](../../src/components/banlist/BanListDonut.tsx)                                                                            | SVG ring of each status's share, total in the middle (decorative)                                                                                   |
| [`BanListChanges.tsx`](../../src/components/banlist/BanListChanges.tsx)                                                                        | "What changed": one column per new status, and the "Show all" popup                                                                                 |
| [`BanListCards.tsx`](../../src/components/banlist/BanListCards.tsx)                                                                            | "Full list": search, status chips, card type, sort, Table / Cards, Show more                                                                        |
| [`BanStatus.ts`](../../src/helper/BanStatus.ts)                                                                                                | Status names in strength order, each status's rule, `toBanStatus` (the API spells statuses several ways), `banStatusClass`, card kind / type labels |
| [`BanListUtil.ts`](../../src/helper/BanListUtil.ts)                                                                                            | `AcceptableBanListFormat`, `getValidFormat`, `determineListSize`                                                                                    |
| [`BanListDateReducer.ts`](../../src/reducers/BanListDateReducer.ts), [`CurrentBanListReducer.ts`](../../src/reducers/CurrentBanListReducer.ts) | Reducers for the dates and the list's content                                                                                                       |
| [`ban-list.css`](../../src/css/main-pages/ban-list.css)                                                                                        | All of the page's styles, including the `.ban-status--<status>` tints                                                                               |
| [`BanList.test.tsx`](../../src/components/pages/__tests__/BanList.test.tsx)                                                                    | Stale answers ignored, and going back restoring the page                                                                                            |
| [`banlist/__tests__/`](../../src/components/banlist/__tests__/)                                                                                | Header, What changed and Full list behaviour                                                                                                        |

## Data

All from the SKC API (`SKC_API_ENDPOINTS` in [`DownstreamServices.ts`](../../src/helper/DownstreamServices.ts)), through `FetchHandler` with its default 6s timeout and error redirect:

1. **Dates** - `banListsUrl?format=<format>` when the format changes. The newest date becomes the selected list.
2. **The selected list** - three requests at once, when the selected date changes:
   - `banListUrl/<date>/cards?format=` - every card on the list by status, with counts.
   - `banListUrl/<date>/new?format=` - cards that moved to a new status, each with its previous status.
   - `banListUrl/<date>/removed?format=` - cards that went back to Unlimited.

Switching format or date cancels the requests in flight (axios `CancelToken`), and an `isCurrent` flag drops any answer already on its way, so a slow answer for the old pick can't replace the new one. Switching format also clears the selected date in the same render (`handleFormatChosen`), so the list's fetch never asks for the old format's date in the new format.

The API leaves out empty lists, so each is defaulted to `[]`. The list before the selected one (next in the newest-first dates) is what "changed since" compares to; the first list in the database has none.

## State and going back

- **`ban-list`** (`useHistoryEntry`, in the page) - one snapshot of the format, selected date, dates and content, saved only once all four loads have finished. On a restore, `isRestored` skips the mount's fetches. A snapshot for another format is ignored.
- **`ban-list-cards`** (`useHistoryEntry`, in `BanListCards`) - the full list's search, status filter, card type, sort, view and how many rows are shown. Saved on every change.
- The Table / Cards view opens in the reader's Settings default via `usePageView` (`list` → Table, `grid` → Cards). The page's own toggle never writes back to the setting.

Picking another list keeps the full list's search, filters and view but starts from the first 30 rows.

## Layout and behaviour

**Header** - a white card. On the left, rcl's `DateBadge` (condensed on phones), the "Effective <date>" eyebrow, "<format> ban list" h1, and either "The current list · N lists in the database" or a purple "Takes effect in N days" chip for a list that isn't in effect yet. On the right, the format segmented control and the date pill. Under them, the totals: a grey tile with the donut beside a 2x2 of tiles in each status's tint (count as h6, status as body2), with an "N changed since <date>" tile in purple. Switching format or date scrolls to the top.

**What changed** - a white sheet with one column per status cards moved to (Now Forbidden, Now Limited, Now Semi-Limited, Back to Unlimited; empty ones are left out). Each column has a tinted head with the count and the status's rule, then rows of round art in its frame ring, name, type and a "was X" status chip, each linking to the card. Columns show 8 rows; "Show all N" opens the whole column in a `Dialog`. It says when nothing changed, or when there's no earlier list to compare to.

**Full list** - search by name, status chips (one status at a time, opening on the strongest status the list has, with a count on each), a card type select (All / Monsters / Spells / Traps), a Color | A–Z sort, and a Table | Cards switch. Color is the API's order - card colour, then name. The table's Card and Type headers sort too, flipping direction on a second click; Status doesn't sort since only one shows at a time. Table rows show the status chip and the previous status (a dash when unchanged); Cards is a grid of rcl's `YGOCardWithImage` with the status chip under each. 30 rows, then Show more, with "N of M cards".

**Status tints** - each status's colours come from a `.ban-status--<status>` class (`banStatusClass`) that sets `--status`, `--status-ink` (text on the tint, 4.5:1 or better) and `--status-tint`, built from the `:root` status colours. Tiles, column heads and chips all read these; the product page reuses them for its purple Suggestions columns. A pressed status filter chip is near-black instead.

Every section has a skeleton built from the same pieces as the loaded version, and the What changed count line is held while loading, so nothing jumps when data arrives.

**Phones** (below `sm`, 600px):

- The header stacks: condensed badge, full-width controls, and the donut tile over the 2x2. The changed tile drops "since <date>" so every tile keeps one shape.
- What changed columns become a swipeable row (scroll-snap); the status chips in the full list become a swipeable row with a `mask-image` fade.
- The table drops its Type and Previous columns and shows them under the name and status chip (`.ban-list-cards__phone-only`).
- "Show all" opens full screen.
- In the Cards grid, a narrow column (container query, 220px) drops "was X" under the chip.

Touch screens (`pointer: coarse`) get 44px controls.

## Accessibility

- One h1, then "What changed" and "Full list" as h2s; each What changed column is a labelled `section` with an h3 (h2 inside its popup).
- `DateBadge` renders its month, day and year as headings, so the header hides it with `aria-hidden` - the eyebrow already reads the date.
- The date `Select` gives every child `role=option`, so the year headings are `aria-hidden` and each option is labelled with its full date range.
- The donut is `aria-hidden`; the tiles carry the numbers, and a visually hidden total precedes "cards restricted on this list".
- Status chips are toggle buttons (`aria-pressed`) in a labelled group; "Show all" has `aria-haspopup='dialog'`.

## Tests

The page test checks that stale answers are ignored and that going back restores the page without refetching; the section tests cover each section's content, filters, sorting, paging, skeletons and restore. All of them mock `skc-rcl`.

## Known issues

- Still on 12px text (the 15px floor): the year headings in the date menu (`overline`), "was" in What changed, the status chip counts, the skeleton's Previous column and the "N of M cards" foot (`caption`).
- rcl's `YGOCardWithImage` (the Cards grid) puts its text on frame colours below 4.5:1 contrast - rcl has to pick text colours per frame.
- `DateBadge`'s headings are hidden as a stopgap; the fix belongs in rcl (plain text or a `component` prop).
