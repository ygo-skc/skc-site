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
- Style overrides of MUI go in local CSS; beat emotion specificity with a doubled class (`.messages__new.MuiChip-root`, `.site-footer .site-footer__heading`), not `!important`.

## Visual direction

Theme: purple storm sky over an active volcano.

- Flat fills only - no gradients, no blur/glassmorphism, no other "AI tells". Depth comes from layering shapes.
- Colours come from the palette in `:root` in `src/index.css` (`--sky`, `--basalt`, `--lava`, `--lava-crack`, `--lava-crest`, `--ember`, `--stone`, `--stone-hover`, `--stone-text`, `--gate*`, `--bolt*`, `--on-dark-*`, ...). Use these variables rather than hex values; derive tints with `color-mix(in srgb, var(--x) N%, #fff | transparent)`.
- Solid text tints on dark backgrounds, not translucent white (translucent text dims over darker bands).
- Watch contrast: lava text on white is only ~2.9:1, so it's for accents (e.g. the day number in the messages popup), not body text.
- Fonts: Open Sans loaded at 400/600/800 only with `font-synthesis: none` - use only those weights. Root font size is ~12.3-13px by breakpoint, so prefer px in local component CSS.
- Idiomatic modern CSS is welcome: BEM-ish class names, container/media queries, `clip-path`, `:is()`.
- Must work at phone width.

## Established components

- Breadcrumbs (`Breadcrumb.tsx`, `breadcrumb.css`): "stepping stones" trail; phones show only the parent crumb as a back stone.
- Chips: "soft tags" (theme `MuiChip` + status tints in `ban-list.css`).
- Messages popup (`Messages.tsx`, `MessageItemComponent.tsx`, `messages.css`): changelog with a date gutter and rail; day of month in lava; unread posts get a lava node and a "New" chip.
- Nav bar and footer: SVG scene backgrounds (sky, bolt, spire, lava) in `navigation-bar.css` / `footer.css`.

## Testing notes

- Jest can't load ESM-only `react-markdown` and `skc-rcl` (pulls in @nivo/d3). Mock them in test files that render components using them (see `src/components/header-footer/__tests__/Messages.test.tsx`).
- Wrap renders in `ThemeProvider theme={MuiTheme}` and `MemoryRouter` when needed.

## Open items

- About page cards (`src/components/about/AboutInfoCard.tsx`): redesign in progress; three richer directions were mocked (trading-card frame, scene header, editorial badge) - awaiting a pick.
- `src/css/main-pages/about.css` leaks a global `li { word-break: break-all }`.
- Forbidden / semi-limited / limited-three status colours aren't in the palette yet.
