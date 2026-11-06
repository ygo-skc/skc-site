# SKC site docs

Developer documentation for the site: how it's put together, and how each page works. Start with [Architecture](architecture.md), then read the page you're about to change.

The rules every page follows - typography, contrast, colours, going back, accessibility - are in [`CLAUDE.md`](../CLAUDE.md#ui-rules). These docs link to them rather than repeat them.

## Pages

One document per route in [`AppRoutes.ts`](../src/helper/AppRoutes.ts).

| Page                | Route                                 | Doc                              |
| ------------------- | ------------------------------------- | -------------------------------- |
| Home                | `/`                                   | -                                |
| Ban list            | `/ban_list/:format`                   | [ban-list.md](pages/ban-list.md) |
| Card Browse         | `/browse/card`                        | -                                |
| Card information    | `/card/:cardId`                       | -                                |
| Product Browse      | `/browse/product`                     | -                                |
| Product information | `/product/:productId`                 | -                                |
| Tier list           | `/tools/tier-list`                    | -                                |
| Pull cost           | `/tools/pull-cost`                    | -                                |
| About               | `/about`                              | -                                |
| Privacy             | `/privacy`                            | -                                |
| Error pages         | `/bad-request`, `/not-found`, ... `*` | -                                |

## Shared pieces

Parts that appear on every page, or on several.

| Piece                                                       | Doc |
| ----------------------------------------------------------- | --- |
| Navigation - nav bar, Utilities menu, breadcrumbs, footer   | -   |
| Search popup - cmd/ctrl + k, the nav button, the home field | -   |
| Messages popup                                              | -   |
| Settings - results view                                     | -   |
| Keyboard shortcuts - `/` and `g` then a letter              | -   |
| Card rows - round art in a frame-colour ring                | -   |

## Writing a page doc

Copy [`_template.md`](_template.md) to `pages/<page>.md` and fill it in from the code - the page component, its children, CSS and tests - leaving out sections that don't apply. Keep it to what a contributor needs before changing the page: where things live, where data comes from, what survives going back, and anything that would surprise them. Link files with relative paths so they stay clickable on GitHub and in editors.

When a page changes, update its doc in the same commit.
