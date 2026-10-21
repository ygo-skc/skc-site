# SKC site

Yu-Gi-Oh! card database front end (thesupremekingscastle.com). React 19, react-router-dom 7, MUI 9, TypeScript, webpack, Jest 30 + Testing Library.

## Commands

- `yarn start` - dev server on http://localhost:3000
- `npx jest <path>` - run tests once (`yarn test` runs in watch mode)
- `npx tsc --noEmit -p .` - type check (lib is ES2021, so no `replaceAll`)
- `yarn lint` - eslint

## Working preferences

- Commit only when asked ("commit", "commit this"). Short past-tense subject lines, e.g. "Restyled chips as soft tags".
- Keep diffs minimal. Don't let prettier reformat lines you didn't change - restore them if it does.
- Prefer small, focused changes. A broad pass that touches too much will be reverted - when a best-practice pass grows large, propose it in pieces.
- For UI work, offer a few distinct options (mockups when visual) and let the user pick before building. Plain or "freshman" looking designs get rejected - aim for polished and intentional.
- When a request is ambiguous about what to change (e.g. "legibility" meant colour, not size), change the narrower thing and confirm.
- Write a test alongside behaviour changes; the suite should stay green with tsc and eslint clean.

## UI rules

- Render text with MUI `<Typography>` (use `component` for semantics, `variant='inherit'` when local CSS owns the look) - not raw `p`/`h*`/`span`/`dt`/`dd`.
- Keep react-router `Link`/`NavLink` for links.
- Use MUI components where one fits (e.g. `Chip` for tags/flags, not a styled span).
- **Do not change the MUI theme (`src/components/MuiTheme.ts`) without asking first.** Fix things locally in component CSS and offer the theme change as a question.
- The theme's text follows a stepped scale (h1 2.8rem down to body2 1.05rem), em margins, unitless line heights, palette text colours (`var(--basalt)`, `--rock`, `--gate-shade`), solid popovers (no blur). `MuiTheme.test.ts` guards these - keep it green when the theme changes.
- Style overrides of MUI go in local CSS; beat emotion specificity with a doubled class (`.messages__new.MuiChip-root`, `.site-footer .site-footer__heading`), not `!important`. Size MUI text on the component root (e.g. chip root, not `.MuiChip-label`) so local classes can still resize it.
- skc-rcl's injected CSS loads at runtime, so stylesheet order can't be relied on to override it - use a doubled class (see `src/css/util/section.css`, which recolours rcl's `Section` headers with the palette).

## Visual direction

Theme: purple storm sky over an active volcano.

- Flat fills only - no gradients, no blur/glassmorphism, no other "AI tells". Depth comes from layering shapes.
- Colours come from the palette in `:root` in `src/index.css` (`--sky`, `--basalt`, `--lava`, `--lava-crack`, `--lava-crest`, `--ember`, `--stone`, `--stone-hover`, `--stone-text`, `--gate*`, `--bolt*`, `--on-dark-*`, ban list statuses `--forbidden*` / `--semi-limited*` / `--limited-three*`, ...). Use these variables rather than hex values; derive tints with `color-mix(in srgb, var(--x) N%, #fff | transparent)`.
- Solid text tints on dark backgrounds, not translucent white (translucent text dims over darker bands).
- Watch contrast: lava text on white is only ~2.9:1, so it's for accents (e.g. the day number in the messages popup), not body text.
- Fonts: Open Sans loaded at 400/600/800 only with `font-synthesis: none` - use only those weights. Root font size is ~12.3-13px by breakpoint, so prefer px in local component CSS.
- Idiomatic modern CSS is welcome: BEM-ish class names, container/media queries, `clip-path`, `:is()`.
- Must work at phone width.
- **Card frame colours (normal, effect, fusion, spell...) and ATK/DEF colours are skc-rcl's, exactly.** Never darken, lighten or `color-mix` them, even for contrast - pick the text colour instead (skc-rcl pairs `#fffbeb` / `#333`), and say so if contrast still falls short. Black text on the yellow normal frame is fine.

## skc-rcl (`../skc-rcl`)

The shared component library (Section, SKCTable, YGOCard*, YGOCardPreview, YGOCardAttribute...). See its own CLAUDE.md.

- Reusable card UI (previews, attribute/level icons, frame-coloured chips) belongs in rcl - don't copy rcl svgs or card colours into this repo.
- rcl is consumer-agnostic: never give it this site's palette. Theme rcl components from here through their `--<component>-*` custom properties (e.g. `.search-palette.MuiPaper-root { --ygo-card-preview-text: var(--basalt) }`).
- To try unpublished rcl changes: `yarn build` in rcl, then copy `../skc-rcl/dist/*` into `node_modules/skc-rcl/dist/` (no package.json change). Restart `yarn start` afterwards - webpack caches `node_modules`, so a running server keeps the old rcl. `yarn install` restores the published version.
- The local API (`localhost:9999`) only allows CORS from port 3000.

## Established components

- Breadcrumbs (`Breadcrumb.tsx`, `breadcrumb.css`): "stepping stones" trail; phones show only the parent crumb as a back stone.
- Chips: "soft tags" (theme `MuiChip` + status tints in `ban-list.css`).
- Messages popup (`Messages.tsx`, `MessageItemComponent.tsx`, `messages.css`): changelog with a date gutter and rail; day of month in lava; unread posts get a lava node and a "New" chip.
- About page cards (`AboutInfoCard.tsx`, `about.css`): open columns with the icon beside the title (option "5C"); each card's badge ring takes a palette colour by position. Contributions use `WalletAddress.tsx` (copy button with a "Copied" status).
- Section headers: rcl's `Section` only accepts named header styles, so `src/css/util/section.css` maps default / ban-list / product headers to `--sky` / `--lava-crack` / `--rock`.
- Search palette (`src/components/util/search/`: `SiteSearch.tsx` provider in `Layout`, `SearchPalette.tsx`, `SearchTrigger.tsx` nav button, `SearchField.tsx` home field, `useSearchShortcut.ts`; `search-palette.css`): cmd/ctrl + k or `/` from any page; the nav button and home field open it too. The card preview (art, attribute, level/rank/scale, type chip in its frame colour, ATK/DEF, effect) is skc-rcl's `YGOCardPreview` - card colours and icons live in skc-rcl, themed here through `--ygo-card-preview-*` custom properties. Cards by name or passcode; "Jump to" page shortcuts show only while the search is empty, and a skeleton holds the cards' place while results load - no product, ban list or page search yet. Desktop previews the highlighted card beside the list; below md it's full screen with an inline peek per card. On phones with the keyboard open, iOS pans the visible area on any drag the list can't use - `usePreventPagePan` cancels those touchmoves (overflow hidden / a fixed body don't help; the fixed body made it worse), and `useVisualViewport` pads the list by the area under the keyboard + Safari's toolbar so the popup still reaches the keyboard.
- Nav bar and footer: SVG scene backgrounds (sky, bolt, spire, lava) in `navigation-bar.css` / `footer.css`.

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
- `MuiTheme.ts` and `NavScene.tsx` already fail prettier on `release`; leave unrelated lines alone.
