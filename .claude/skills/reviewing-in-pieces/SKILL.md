---
name: reviewing-in-pieces
description: Use when asked to review uncommitted or branch changes in skc-site, especially a large working tree - splits the review by page/feature, fixes findings as each piece is reviewed, and commits one piece at a time.
---

# Reviewing changes in pieces

## Overview

A large working tree is reviewed one page or feature at a time, not as one diff. Each piece is summarised, reviewed,
fixed and (when asked) committed before moving to the next, so the user never has to hold the whole change in their head.

## 1. Split the work

- `git status --short` - include untracked folders (`??`, e.g. a new `__tests__/`) and anything already staged (`A`, `D`).
  Note pre-staged entries; they must not leak into another piece's commit.
- Group files by page/feature, e.g. Home: Trending · Theme and tokens · Nav and breadcrumb · Messages · Footer and search ·
  rest of Home · card/product/ban list/About. Shared foundations (theme, `index.css`) get their own piece.
- Show the plan as a numbered table (piece → files) and start with the piece the user named, else the first.
- When asked to list files again, list them grouped by piece with (A)/(D) marked and which are pre-staged.

## 2. Review one piece

Report in this order, concisely:

1. **Files** in the piece.
2. **What changed** - a short behavioural summary per file (what a user sees, not a line-by-line diff).
   If the user asks for "code changes only (tsx)", summarise just the components.
3. **Findings**, numbered, most important first. Each says what's wrong, where (`file:line`), why it matters and the fix.
4. **Fine as is** - things checked and deliberately left alone, so they aren't re-raised.
5. **Not from these changes** - pre-existing issues spotted along the way, flagged for later or the backlog.
6. Ask which findings to fix, with a recommendation. Design choices get distinct options (recommended first).

Verify before claiming:

- Measure in the browser rather than reasoning about CSS: computed styles (`getComputedStyle`), element heights at several
  widths, contrast ratios. Specificity clashes and "this hover will be invisible" guesses are often wrong - check.
- Screenshot at desktop (1280) and phone (390) width for anything visual.
- Read a stash / branch / file before describing it (a stash once called "merged" was actually shelved dark-mode work).

Things worth looking for here (beyond the CLAUDE.md UI rules):

- Leftovers of a removed design: dead components/CSS files nothing imports, classes nothing renders, stale comments.
- Duplicated logic between sibling components (extract a small helper).
- Accessibility: `aria-label` is ignored on a plain `div`/`span` (use `aria-hidden` visuals + visually hidden text);
  skipped heading levels; decorative CSS `content` read aloud (`content: '·' / ''`); focus rings clipped by `overflow`.
- Contrast: white text on bright system colours; use the `-text` / `-ink` shades.
- Units: text in rem, spacing/radii/icons in px; flag rem spacing (it grows with the reader's text size).
- `!important` and old hard-coded hex values - replace with doubled classes and tokens.
- Loading placeholders sized to the loaded content at each breakpoint (measure it).

## 3. Fix what was agreed

- Change only the agreed findings; keep diffs minimal. Theme changes still need the user's OK.
- Add or update a test for behaviour changes. Run `npx jest`, `npx tsc --noEmit -p .`, `yarn lint`.
- Re-check visually what changed, then report each fix in a line or two with the verification.
- Record deferred items in CLAUDE.md's open items / backlog when the user says "backlog".

## 4. Commit the piece (only when asked)

- Before committing, check cross-piece dependencies: does this piece use tokens, classes or components defined in files
  still uncommitted (or remove ones other committed files still use)? If so, say so and offer to include them, or note
  that later pieces must be committed before pushing.
- Stage exactly the piece's files. If a file spans pieces, stage only its hunks (`git diff HEAD -- f > p.patch`, trim,
  `git apply --cached`).
- Temporarily unstage pre-staged entries from other pieces (`git restore --staged ...`), commit, then re-stage them.
- Short past-tense subject (e.g. "Restyled nav as a capsule with a sliding lens"), plus the attribution trailer.
- Never push. After each commit, report the hash, what was included or held back, and what's left.

## Common mistakes

- Reviewing everything at once - one piece at a time, and wait for the user before moving on.
- Committing a piece that references styles only defined in an uncommitted file without warning.
- Sweeping up pre-staged files from another piece into the commit.
- Stating a cause without measuring it, then retracting it.
- Deleting a stash or file because a summary said it was done - read it first, and confirm destructive steps.
