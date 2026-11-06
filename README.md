# SKC Site

[![Build & Code Quality](https://github.com/ygo-skc/skc-site/actions/workflows/build-and-code-quality.yaml/badge.svg)](https://github.com/ygo-skc/skc-site/actions/workflows/build-and-code-quality.yaml)

The front end of [thesupremekingscastle.com](https://thesupremekingscastle.com), a Yu-Gi-Oh! card database. It shows content from three services:

- **SKC API** - cards, products, ban lists, search and database stats.
- **SKC Suggestion Engine** - card of the day, trending, and the cards and products a card links to.
- **Heart API** - YouTube uploads, upcoming events and site messages.

Built with React 19, react-router 7, MUI 9 and TypeScript, bundled with webpack and tested with Jest + Testing Library. Card UI (previews, card images, frame colours) comes from the shared component library [skc-rcl](https://github.com/ygo-skc/skc-rcl).

## Scripts

| Script                                 | Purpose                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `yarn start`                           | Dev server on port 3000, against the local API                            |
| `yarn build`                           | Production bundle in `build/`, against the local API                      |
| `yarn build:development_remote`        | Production bundle against the remote dev API                              |
| `yarn build:production`                | Production bundle against the production API                              |
| `yarn test`                            | Jest in watch mode, with coverage                                         |
| `yarn ci:test`                         | Jest once, with coverage - what CI runs                                   |
| `yarn lint`                            | eslint over `src`                                                         |
| `yarn mutation`                        | Stryker mutation testing (see below)                                      |
| `yarn deploy:prod` / `yarn deploy:dev` | Build and upload to S3 behind CloudFront ([`deploy-s3.sh`](deploy-s3.sh)) |

Type check with `npx tsc --noEmit -p .` and run a single test file with `npx jest <path>`.

## Documentation

How the site is put together and how each page works lives in [`docs/`](docs/README.md):

- [Architecture](docs/architecture.md) - routing, layout, going back, fetching, styling and testing.
- [Pages](docs/README.md#pages) - one document per page.
- [Shared pieces](docs/README.md#shared-pieces) - the nav, search popup, messages, settings and shortcuts.

The site's UI rules and visual direction are in [`CLAUDE.md`](CLAUDE.md).

## Working on skc-rcl alongside the site

To try unpublished skc-rcl changes, run `yarn build` in `../skc-rcl`, copy `../skc-rcl/dist/*` into `node_modules/skc-rcl/dist/`, then restart `yarn start` (webpack caches `node_modules`). `yarn install` puts the published version back.

## Mutation testing

[Stryker](https://stryker-mutator.io) changes the code in small ways and checks that a test fails for each change, to show the tests actually check behaviour. It's configured in [`config/stryker.conf.json`](config/stryker.conf.json) and needs `@stryker-mutator/core`, `@stryker-mutator/jest-runner`, `@stryker-mutator/typescript-checker` and `jest-environment-jsdom` in `devDependencies`.
