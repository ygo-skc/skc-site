---
name: releasing-the-api
description: Use when cutting a release for skc-site — choosing the version, creating and pushing a version tag, or publishing GitHub release notes.
---

# Releasing skc-site

## Overview

skc-site is the deployed website. Nothing imports it and it publishes nothing, so tags are bare
`vX.Y.Z` with no prefix, and they are lightweight.

The version of record is the `version` field in `package.json`:

```json
"version": "2.1.0",
```

That is the only place a version is written — no CHANGELOG, no version constant in source, no
README badge. The `package.json` string has no `v` prefix; the tag does.

**The version is user-visible.** `webpack.config.ts` imports `package.json` and bakes it into the
bundle:

```ts
import * as packageInfo from './package.json'
…
'process.env.REACT_APP_VERSION': JSON.stringify(packageInfo.version),
```

and `src/components/header-footer/Footer.tsx` renders it:

```tsx
<strong>SKC Web:</strong> v{process.env.REACT_APP_VERSION}
```

Two facts to keep straight:

- **Pushing a `v**` tag re-runs `Build & Code Quality` and nothing else.** It does not deploy. The
  new footer version is not live until a separate, manual `yarn deploy:prod`, which needs AWS
  credentials and clears the S3 bucket before syncing.
- Historically `master` is fast-forwarded to the tag commit after a release. That is not part of
  this procedure.

## Pre-flight

The default branch is `release`. Run from an up-to-date checkout of it.

Read the version first. It decides whether there is a release to cut at all, and running the gates
before that question is settled wastes them on a release you may be told not to cut.

```bash
git fetch --tags --prune
git status --porcelain
grep -n '"version"' package.json
PREV=$(git tag --list 'v*' --sort=-v:refname | head -1)
```

**`git fetch --tags --prune` comes first and is not optional.** `git tag --list` reads local refs
only, so on a checkout that hasn't fetched recently `$PREV` silently resolves behind.
(`git ls-remote --tags origin` answers the same question without writing to `.git`.)

**Keep the `'v*'` glob.** This repo carries tags that are not releases — one missing its `v` prefix,
and a local-only `backup/` marker pointing into the unreleased range. `--sort=-v:refname` happens to
rank them below the real releases today, so dropping the glob would currently still work; the glob
is there so that stays true when someone adds a tag that sorts differently. It is cheap insurance,
not a live bug being dodged.

**`git status --porcelain` must be clean before you tag, and re-check it immediately before
tagging.** The gate commands run against the working tree, but a tag captures only committed state —
so uncommitted work lets every check pass on code that will not be in the release. **Entries under
`.claude/` are the exception** — this skill itself, tracked or not; nothing there reaches the bundle.
Anything else blocks the tag, including any untracked file under `src/`: it compiles into the bundle
you just verified and is absent from the commit you are about to tag. This checkout is edited frequently and has moved
mid-release more than once, so treat this as a precondition, not a formality.

Then confirm the tag and release you are about to create don't already exist:

```bash
git ls-remote --tags origin "refs/tags/vX.Y.Z"
gh release view vX.Y.Z --repo ygo-skc/skc-site
```

Empty output from the first and `release not found` from the second mean it is safe to continue. If
either finds something, this release is already cut — **stop.**

**The `package.json` version is the source of truth — read it first.** If it already names an
unreleased version, that is the version to cut: match it and skip the bump table.

**If the version still equals `$PREV`** — the bump has not been committed — **stop. Do not tag.**
Report which version it should become and let the user make that edit, commit it (`Updated version`
is the established subject), and push. Tagging ahead of the bump means the next deploy ships a
footer reporting the previous version on every page. Don't make that edit yourself as part of
cutting a release.

Only once the version is settled, run the gates:

```bash
git log --oneline "$PREV"..HEAD
git diff --stat "$PREV"..HEAD
yarn ci:test
yarn lint
yarn build:production
```

Four things about the gate:

- **Never run `yarn test`.** It is `jest --coverage --watchAll` — watch mode, which never exits.
  `yarn ci:test` is the non-interactive variant.
- `yarn ci:test` applies the global floors in the `jest.coverageThreshold` block of `package.json`,
  but there is **no `collectCoverageFrom`** — so coverage is measured only over files a test actually
  imports, and untested source is invisible to the metric rather than dragging it down. The
  thresholds therefore rarely bite, and a passing coverage number says nothing about the code this
  release is shipping. Don't read it as a safety net; read the block for the current floors if a
  failure does appear.
- **`.ts` files are never typechecked here.** `ts-loader`'s rule matches `.tsx` only, and jest
  transpiles through babel, so a type error in `src/helper/*.ts` or `src/reducers/*.ts` fails
  neither the build nor the tests. Only `yarn mutation` typechecks them, and it is too slow for a
  release gate.
- **Gate on `build:production`, not `build`.** `yarn build` is `webpack --mode production --env dev`
  — a production-mode bundle pointed at local dev hosts. CI runs only that one, so nothing in CI
  proves the production bundle compiles. `build:production` is what actually ships.

## Choosing the version

Nothing installs this site and it exposes no API, so its version promises no compatibility to
anyone. Semver here describes **what a visitor experiences**.

The commit log cannot decide the bump: history is overwhelmingly Renovate squashes and not
Conventional Commits, so this is a judgment call about the rendered site.

| Bump | When |
| --- | --- |
| Patch | Dependency bumps, refactors, bug fixes — nothing a visitor would notice |
| Minor | A new page, a new route, or a visible feature |
| Major | A redesign, a removed page, or a changed URL that breaks existing links and bookmarks |

Picking up a new `skc-rcl` is the most common reason to release here, and Renovate automerges its
minor and patch bumps without review — so new components may already be on `release` with no human
commit to show for it. That is a **patch unless the new components change something a visitor
sees.** There is no visual regression test and no snapshot test in this repo, so judge the rendered
page, not the dependency's own version number. skc-rcl also emits global CSS class names that this
site defines, and this site styles classes skc-rcl owns, so a library bump can shift layout with no
type error and no failing test.

## Release notes

**Title:** `vX.Y.Z: Short Summary` — the norm here; nearly every release carries one. A bare tag
name is the exception.

**Body**, in this order:

1. `## Main change` — one `*` bullet per human change, two-space-indented sub-bullets for detail.
   Omit this heading **only when the human-commit list below is empty**.
2. Blank line, then `## Updated deps` — the Renovate lines as GitHub writes them
   (`* <title> by @renovate[bot] in <PR url>`). This is an H2, a sibling of `## Main change`, not an
   indented sub-heading.
3. Blank line, then
   `**Full Changelog**: https://github.com/ygo-skc/skc-site/compare/<PREV>...<NEW>`

Borrow the bot lines and the footer instead of retyping them. This returns the generated body
without creating anything:

```bash
gh api repos/ygo-skc/skc-site/releases/generate-notes \
  -f tag_name=vX.Y.Z -f previous_tag_name="$PREV" --jq .body
```

Take the bot lines and the footer from that output and restructure them. Don't publish it as-is: it
files every Renovate bullet under `## What's Changed` and says nothing about what actually changed.
Keep the bot lines in the order GitHub returns them, even where that isn't ascending by PR number.

**`generate-notes` is not enough on its own, and this is the easy way to lose real work.** It lists
only merged PRs, and human changes here are pushed straight to `release` with no PR — so they appear
nowhere in the generated body. Get them from git instead:

```bash
git log --format='%h %an | %s' "$PREV"..HEAD | grep -vi renovate
```

Every commit that survives that filter and actually shipped something needs its own
`## Main change` bullet, written **from the diff rather than from the subject line** — subjects here
are terse and sometimes actively misleading about scope. Merge commits and reverts that cancel each
other out get no bullet.

Use `*` for bullets, not `-`. Write `notes.md` to a scratch directory, not into the repo.

Blank lines go only before `## Updated deps` and before the footer — never between two `*` items. A
heading ends a list; a blank line doesn't. GitHub keeps both sides as one list and renders the whole
thing "loose", wrapping every item in a `<p>` with paragraph margins. Check the file before
publishing:

```bash
awk '/^[ ]*\* /{i=1; if (g) {print "LOOSE"; exit}; next} /^$/{if (i) g=1; next} {i=g=0}' notes.md
```

No output means the list is tight.

## Sequence

Show the version, the diff, the three gate results, and the drafted notes. Get approval **once**.
Then re-check that `git status --porcelain` is empty, and run all three steps without stopping
again:

```bash
git tag vX.Y.Z <commit>          # HEAD of release; lightweight: no -a, no -m
git push origin vX.Y.Z
gh release create vX.Y.Z --repo ygo-skc/skc-site \
  --title "vX.Y.Z: Short Summary" --notes-file notes.md
```

Push the tag first. `gh release create` attaches to an existing tag but invents one from the
default branch when the tag is missing.

## Why approval comes before the push

The pushed tag is the release marker, the GitHub Release is the public record of what changed, and
the version in it is what the site's footer will report to every visitor once deployed. Approval is
the last cheap moment — after the push, a wrong version is corrected with another release, not an
edit.

## Common mistakes

- **`git tag -a`.** Every `v2.x` tag is lightweight; the annotated ones are all `v1.x` leftovers
  from when tag messages served as the changelog. Don't take an old one as precedent.
- **Running `yarn test`.** Watch mode — it never exits. Use `yarn ci:test`.
- **Gating on `yarn build`.** That builds a production-mode bundle pointed at local dev hosts. Use
  `build:production`, the one that ships.
- **Tagging with a dirty working tree.** The tag captures committed state only, so the gate you just
  ran proved nothing about what you tagged.
- **Publishing an empty body.** `v2.0.9` shipped with no release notes at all.
- **Falling back to the older, thinner shapes.** `v2.0.8` and `v2.0.6` are a bare `## Changes` plus
  one bullet; `v2.0.7` uses a single-hash `# Changes`; `v2.0.4` is GitHub's `## What's Changed`
  pasted wholesale. `v2.1.0` is the shape to follow.
- **Borrowing skc-rcl's headings.** That repo uses `## What's Changed` and `### PR's`. This one uses
  `## Main change` and `## Updated deps`.
- **Dropping the Full Changelog footer.** Most releases before `v2.1.0` lack it. It is the last line.
- **Assuming the tag push deploys.** It runs CI and nothing more; the footer keeps showing the old
  version until `yarn deploy:prod`.
- **A blank line between `*` items.** It turns the entire list loose, so every item gets paragraph
  spacing. Run the `awk` check on `notes.md` whatever its origin.
