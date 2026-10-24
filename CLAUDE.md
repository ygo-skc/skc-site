# SKC site

Yu-Gi-Oh! card database front end (thesupremekingscastle.com). React 19, react-router-dom 7, MUI 9, TypeScript, webpack, Jest 30 + Testing Library.

## Commands

- `yarn start` - dev server on http://localhost:3000
- `npx jest <path>` - run tests once (`yarn test` runs in watch mode)
- `npx tsc --noEmit -p .` - type check (lib is ES2021, so no `replaceAll`)
- `yarn lint` - eslint

## Working preferences

- Commit only when asked ("commit", "commit this"). Short past-tense subject lines, e.g. "Restyled chips as grey capsules".
- Keep diffs minimal. Don't let prettier reformat lines you didn't change - restore them if it does.
- Prefer small, focused changes. A broad pass that touches too much will be reverted - when a best-practice pass grows large, propose it in pieces.
- For UI work, offer a few distinct options (mockups when visual) and let the user pick before building. Plain or "freshman" looking designs get rejected - aim for polished and intentional.
- When a request is ambiguous about what to change (e.g. "legibility" meant colour, not size), change the narrower thing and confirm.
- Write a test alongside behaviour changes; the suite should stay green with tsc and eslint clean.
- Reviewing a large change: follow the `reviewing-in-pieces` skill - split by page/feature, fix findings as each piece is reviewed, commit one piece at a time when asked.
- Verify before stating a cause - measure computed styles, sizes and contrast in the browser rather than reasoning about CSS. Read a stash, branch or file before describing or deleting it.

## UI rules

- Render text with MUI `<Typography>` and a theme variant (use `component` for semantics) - not raw `p`/`h*`/`span`/`dt`/`dd`. `variant='inherit'` only for a piece nested inside another Typography (e.g. a `<time>` inside an overline).
- **No font overrides on text in component CSS** - no `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform` or `font-family`. Pick the theme variant that fits; colour is the only thing to change locally (CSS or inline). When a variant's theme colour fights the parent's (e.g. text inside a link), make the Typography `color: inherit` from CSS - the `color='inherit'` prop loses to the variant's colour. Resets that hand control back to the theme are fine (`font: inherit` on a `ButtonBase`, `font-family: inherit` on `kbd`), and so are icon sizes (`.MuiSvgIcon-root`). Emphasis comes from colour, not weight (search matches, the messages "New" label).
- Keep react-router `Link`/`NavLink` for links.
- Accessibility: `aria-label` only works on elements with a role (links, buttons, inputs) - on a plain `div`/`span` (e.g. a non-clickable `Chip`) screen readers ignore it, so mark the visual `aria-hidden` and add visually hidden text (the `.visually-hidden` class in `index.css`). Keep heading levels sequential (markdown headings inside a post sit one level below its title). Give decorative CSS `content` empty alt text (`content: '·' / ''`). Keep focus rings inside scrolling containers (`outline-offset: -2px`), since `overflow` clips them.
- Toggles between views or formats are segmented controls (`ToggleButtonGroup`, grey `--capsule-track` with a white lens under the selection, like the nav and Trending) - not solid button groups where the selection can't be seen.
- Use MUI components where one fits (e.g. `Chip` for tags/flags, not a styled span).
- **Do not change the MUI theme (`src/components/MuiTheme.ts`) without asking first.** Fix things locally in component CSS and offer the theme change as a question.
- The theme's text follows apple's web type scale in rem off a 16px root: h1 40px → h6 19px (h1-h5 step down on phones), `subtitle1` / `body1` 17px, `subtitle2` / `body2` 15px, `caption` / `overline` 12px (apple's floor; overline is uppercase) for small labels, counts and dates. Chips match body2, em margins, unitless line heights, palette text colours (`var(--capsule-text)`, `--capsule-muted`), solid popovers (no blur). Primary is apple's increased-contrast system purple `#8944ab` (= `--accent-text`) since MUI puts white text on it (contained buttons) and uses it as text (tabs); secondary system orange `#ff9500` (= `--secondary`). `MuiTheme.test.ts` guards these - keep it green when the theme changes.
- Style overrides of MUI go in local CSS; beat emotion specificity with a doubled class (`.messages__new.MuiChip-root`, `.site-footer .site-footer__heading`), not `!important`.
- skc-rcl's injected CSS loads at runtime, so stylesheet order can't be relied on to override it - use a doubled class (see `src/css/util/section.css`, which recolours rcl's `Section` headers).

## Visual direction

Theme: apple's current web UI - light grey page, near-black text, white cards and capsules with hairline edges, purple accent.

- Flat fills only - no gradients, no blur/glassmorphism, no other "AI tells". Depth comes from layering shapes and hairlines (`box-shadow: 0 0 0 1px var(--capsule-edge)`, or the `.hairline-edge` class), not drop shadows - floating menus (popovers, autocomplete) are the exception, with one soft lift. A `mask-image` fade on content (the path bar's chevrons) is fine since nothing is painted.
- Colours come from `:root` in `src/index.css`; use the variables rather than hex values, and derive tints with `color-mix(in srgb, var(--x) N%, #fff | transparent)`.
  - Neutrals: `--page` (#f5f5f7 body), `--capsule` (bars and sheets), `--capsule-track` (grey pills / fields / tracks), `--capsule-lens` (white piece on a track), `--capsule-edge` (hairlines), `--capsule-hover`, `--capsule-text` (#1d1d1f), `--capsule-muted`.
  - Accent: `--accent` (#af52de) for fills without text - dots, rings, carets, focus rings. `--accent-text` (#8944ab) for text, and for fills that carry white text (`--on-accent`) - white on `--accent` is only ~4.1:1.
  - Secondary: `--secondary` (#ff9500) / `--secondary-text` (#c93400), used only for "new" markers (messages "N new" tag and "New" eyebrow) and the About diamonds. It's the same orange as `--limited`, so don't spread it where it could read as a ban status.
  - Ban list statuses (apple system colours): `--forbidden` / `--limited` / `--semi-limited` / `--limited-three`, each with an `-ink` shade for text on its tint (4.5:1 or better).
- Watch contrast: bright system colours (orange, red, `--accent`) fail as text on white or under white text - use the `-text` / `-ink` shade.
- Fonts: Open Sans loaded at 400/600/800 only with `font-synthesis: none` - use only those weights. The root is `font-size: 100%` (the browser's 16px, and the reader's text-size setting) at every width - don't set it in px or per breakpoint; the theme sizes text in rem from it. Spacing, radii, widths and icon sizes are in px (local CSS and the theme's overrides), so only text grows with the reader's setting. The exception is `section.css`, whose header radii stay in rem to match rcl's own rem card radii.
- Idiomatic modern CSS is welcome: BEM-ish class names, container/media queries, `clip-path`, `:is()`.
- Must work at phone width.
- **Card frame colours (normal, effect, fusion, spell...) and ATK/DEF colours are skc-rcl's, exactly.** Never darken, lighten or `color-mix` them, even for contrast - pick the text colour instead (skc-rcl pairs `#fffbeb` / `#333`), and say so if contrast still falls short. Black text on the yellow normal frame is fine.

## skc-rcl (`../skc-rcl`)

The shared component library (Section, SKCTable, YGOCard*, YGOCardPreview, YGOCardAttribute...). See its own CLAUDE.md.

- Reusable card UI (previews, attribute/level icons, frame-coloured chips) belongs in rcl - don't copy rcl svgs or card colours into this repo.
- rcl is consumer-agnostic: never give it this site's palette. Theme rcl components from here through their `--<component>-*` custom properties (e.g. `.search-palette.MuiPaper-root { --ygo-card-preview-text: var(--capsule-text) }`).
- To try unpublished rcl changes: `yarn build` in rcl, then copy `../skc-rcl/dist/*` into `node_modules/skc-rcl/dist/` (no package.json change). Restart `yarn start` afterwards - webpack caches `node_modules`, so a running server keeps the old rcl. `yarn install` restores the published version.
- The local API (`localhost:9999`) only allows CORS from port 3000.

## Established components

- Nav bar (`NavigationBar.tsx`, `SubNav.tsx`, `navigation-bar.css`, `navigation-icon.css`): a floating capsule with the links in a grey track; a white lens slides under the current link (`SubNav` sets `--lens-x` / `--lens-w` and `data-lens` from the `aria-current` link, re-measured by a `ResizeObserver` - jsdom has none, so `setupTests` stubs it). Phones stack the links under the brand in a 24px-radius card.
- Breadcrumbs (`Breadcrumb.tsx`, `breadcrumb.css`): a path bar - quiet parent links in a grey track with mask-image chevrons, the current page on a white lens; phones show only the parent crumb as a back button.
- Chips: grey capsule tags (theme `MuiChip` + status tints in `ban-list.css`).
- Messages popup (`Messages.tsx`, `MessageItemComponent.tsx`, `MessageRow.tsx`, `messages.css`): a capsule sheet; new posts in full as white cards ("New · date" eyebrow in `--secondary-text`, long bodies clipped to 5 lines with Read more), a "You're caught up" pill, then older posts folded into rows under iOS-style year headings, grouped in a white card with inset hairlines. With nothing new the latest post stays in full. Header shows an orange "N new" tag, or the update count. Posts fold into rows after the popup fades out (`onExited`), not on close.
- About page cards (`AboutInfoCard.tsx`, `about.css`): open columns with the icon beside the title; badge rings in `--accent`, topics marked with `--secondary` diamonds. Contributions use `WalletAddress.tsx` (copy button with a "Copied" status).
- Section headers: rcl's `Section` only accepts named header styles, so `src/css/util/section.css` turns default / ban-list / product headers into a near-black `--capsule-text` bar with `--page` text (top radii matched to the card so no light slivers show), and the card shadow into a hairline. Card-coloured headers keep rcl's colours.
- Search palette (`src/components/util/search/`: `SiteSearch.tsx` provider in `Layout`, `SearchPalette.tsx`, `SearchTrigger.tsx` nav button, `SearchField.tsx` home field, `useSearchShortcut.ts`; `search-palette.css`): cmd/ctrl + k or `/` from any page; the nav button and home field open it too. "Spotlight" look: a `--capsule` sheet with a borderless input over a hairline, round thumbnails, matched letters in `--accent-text` (colour only, no extra weight); on desktop the highlighted row is a solid `--accent-text` pill with white text, and the card preview sits on a white panel. Phones get a grey pill field, the peeked row as a white card and a pill Open button. The home field (`database-search-styles.css`) is a grey `--capsule-track` pill. The card preview (art, attribute, level/rank/scale, type chip in its frame colour, ATK/DEF, effect) is skc-rcl's `YGOCardPreview` - card colours and icons live in skc-rcl, themed here through `--ygo-card-preview-*` custom properties. Cards by name or passcode; "Jump to" page shortcuts show only while the search is empty, and a skeleton holds the cards' place while results load - no product, ban list or page search yet. Desktop previews the highlighted card beside the list; below md it's full screen with an inline peek per card. On phones with the keyboard open, iOS pans the visible area on any drag the list can't use - `usePreventPagePan` cancels those touchmoves (overflow hidden / a fixed body don't help; the fixed body made it worse), and `useVisualViewport` pads the list by the area under the keyboard + Safari's toolbar so the popup still reaches the keyboard.
- Footer (`Footer.tsx`, `footer.css`): a capsule panel matching the nav's width; versions in a white grouped list, muted links, container query for narrow widths.
- Ban list (`BanList.tsx`, `src/components/banlist/`, `ban-list.css`, statuses in `helper/BanStatus.ts`): `BanListHeader` - a white card: rcl `DateBadge` (normal, its own colours), "Effective <date>" eyebrow, "<format> ban list" h1, list count or a purple "Takes effect in N days" chip, TCG / Master Duel segmented control + grey date pill, and a strip of white total pills (status dot, near-black count, grey label, plus "N changed since <date>"); `BanListChanges` - "What changed" as one white column per new status (tinted head with count and rule, inset-hairline rows with a "was X" status chip, 8 rows, then "Show all N" opens the whole column in a popup - full screen on phones); `BanListCards` - "Full list" sheet with search, status filter chips (near-black when pressed), card type select and a Table | Cards switch, 30 rows then Show more. Phones: condensed badge, full-width stacked controls, totals / status filters / What changed columns as swipeable rows (scroll-snap, mask-image fade), and the table drops its Type and Previous columns, showing them under the name and status chip (`.ban-list-cards__phone-only`). Status tints come from `.ban-status--<status>` custom properties (`--status`, `--status-ink`, `--status-tint`). Duel Links isn't supported anymore - `/ban_list/DL` opens TCG.
- Home: stat tile labels (rcl `Tile`, colour passed as a prop in `DatabaseInfo.tsx`) all in `--accent-text`; YouTube upload cards stay red, flat `--forbidden-ink` so their white titles keep 4.5:1.
- Home upcoming products (`UpcomingTCGProducts.tsx`, `event.css`): a white sheet like Trending's with a copy-link button, then a to-scale timeline rail from today (black tick) to just past the last release - each release a dot placed by its date (`--at` %), dates in two alternating rows above, months below - and the picked release in a panel under it (rcl `DateBadge`, purple countdown chip, markdown notes, grey "Product page" pill). Phones (container query) hide the date labels and shrink the dots so releases a week apart don't touch. No dialog.
- Home suggestions (`.suggestions` in `headline.css`, `CardOfTheDay.tsx`, `DiscordPresence.tsx`): a white sheet like Trending's - "Card of the day" heading + date, rcl's `YGOCardPreview` as one link (effect in a grey well), then "Join the Discord" under a hairline from Discord's public `widget.json` - "N online · #channels" with a grey Join pill, and the members online as rows in a grey group (avatar with a status `Badge` dot - online green, idle orange, dnd red - and the game they're playing). The widget is read with plain `fetch` - FetchHandler's `CLIENT_ID` header fails Discord's CORS preflight. The footer hides if the widget is off.

## Testing notes

- Jest can't load ESM-only `react-markdown` and `skc-rcl` (pulls in @nivo/d3). Mock them in test files that render components using them (see `src/components/header-footer/__tests__/Messages.test.tsx`). Anything that can open the search popup needs `jest.mock('skc-rcl', () => ({ YGOCardPreview: ... }))`.
- Wrap renders in `ThemeProvider theme={MuiTheme}` and `MemoryRouter` when needed.
- Responsive behaviour: mock `window.matchMedia` with live listeners to simulate a resize (see `resizeTo` in `SearchPalette.test.tsx`).
- jsdom puts spaces around `<mark>` when computing accessible names - give options with highlighted text a plain `aria-label`.
- For visual checks, a headless Chrome screenshot of localhost:3000 works; run screenshot scripts one at a time (a shared debugging port mixes runs). The dev server's type checker can keep reporting deleted files until `yarn start` is restarted - `npx tsc` is the source of truth.

## Open items

- **Back navigation is broken because of how the site pushes links - revisit how links navigate.** Not diagnosed yet; places that touch history to start from: `LinkBehavior.tsx` (MUI `Link` → react-router `Link`), `navigate(..., { replace: true })` in `BanList.tsx`, `window.location.assign` error redirects in `FetchHandler.ts`, and `navigate` calls in the search popup and home tiles. Reproduce with real back/forward before changing anything.
- skc-rcl 1.4.0 is published (`YGOCardPreview`, `YGOCardAttribute`, compact `SKCTable`, `SKCStatGrid`). Still to do here: bump `package.json` to 1.4.0 (the search popup needs it), switch product info and the Card Browse totals to `SKCStatGrid`, and set `--skc-table-*` / `--skc-stat-grid-*` to the palette.
- The search API (`/api/v1/card/search`) doesn't return `monsterAssociation`, so the preview's level/rank/scale/link items never show from search results.
- Card pages' breadcrumbs read Home › Product Browse › <card> - should be Card Browse. The crumb is hard-coded in `src/reducers/CardInformationReducer.ts` (`pageBreadcrumbs: ['Home', 'Product Browse', ...]`).
- `MuiTheme.ts`, `navigation-bar.css` and `navigation-icon.css` already fail prettier on `release`; leave unrelated lines alone.
- **Backlog - skc-rcl pieces still in their own colours** (the rest of the site is on the apple palette):
  - `InlineDate` - the hot-pink month badge on Card of the Day (`CardOfTheDay.tsx`).
  - `Hint` - the lavender box behind "No Content To Show" (`CardDisplayGrid.tsx`) and "Not tied to any archetype" (`CardInformation.tsx`, `ProductInformation.tsx`).
  - `DateBadge` renders its month, day and year as `h6` / `h3` / `h6` headings, which breaks the page outline (the ban list header hides it with `aria-hidden` as a stopgap). The fix is in rcl: plain text (or a `component` prop) instead of headings.
  - `YGOCardPreview` text contrast on white falls short of 4.5:1 (measured on Card of the Day; the search popup uses the same preview): ATK `rgba(255,77,77,.93)` 3.27:1, DEF `rgba(77,166,255,.9)` 2.56:1, and the type chip's `#fffbeb` on the effect orange 3.15:1 (`#333` only reaches ~3.7:1). Card / ATK / DEF colours can't change, so the fix is in rcl - e.g. near-black values with the colour as an accent (a dot or underline), and the darker text pairing where it passes.
  - The published rcl exposes no `--inline-date-*` / `--hint-*` custom properties, so the clean fix is in rcl first (neutral defaults + custom properties, per its consumer-agnostic rule), then set them here to the palette (e.g. `--capsule-track` for the hint, `--accent-text` for the month). A doubled-class override from this repo works as a stopgap.
