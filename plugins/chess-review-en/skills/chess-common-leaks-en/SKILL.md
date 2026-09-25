---
name: chess-common-leaks-en
description: Build a common-leaks and progress archive after the same player has at least 10 completed interactive game reviews. Once enabled, update it incrementally after each new review. Use for recurring mistakes and cross-game progress, not first-game analysis or background monitoring.
---

# Common leaks and progress

Use the neighboring [chess-review-open-en](../chess-review-open-en/SKILL.md) for individual reviews. Reuse its verified PGNs, analysis, templates and engine.

## First activation

1. Locate the user's review folder and confirmed identity, including `.chess-review-account.json` where available. Keep different players in separate folders and confirm their side per game.
2. Run `plan_common_leaks.py` to count distinct completed reviews. Raw PGNs, duplicate games and HTML that does not match its PGN do not count. At least 10 are needed for first activation; this is a product threshold, not a statistical guarantee.
3. Below 10, report the count and shortfall and finish the requested individual review. Do not fetch or analyze extra history without a request.
4. At 10, a direct request for common leaks authorizes activation. During a single-game task, deliver that review first and optionally offer once. Do not activate by default or repeatedly ask after refusal. Preferences stay in `.chess-review-preferences.json`; record `common_leaks_offered: true` to avoid repeated offers.
5. Initially select the latest 10 completed reviews. Give an 8–20 minute estimate, plan for 25 minutes plus 5 for validation, aiming for under half an hour. Defer larger history; reuse analysis. These are estimates, not guarantees.

Resolve `REVIEW_SKILL_DIR` to the neighboring skill's actual directory and use available Python:

```sh
python "$REVIEW_SKILL_DIR/scripts/plan_common_leaks.py" chess-reviews --user CONFIRMED_USERNAME --enable --out work/leaks-plan.json
```

Pass `--enable` only with authorization. Use `--disable` when requested, preserving past pages. Meeting the count is not consent.

## Evidence and delivery

Follow [the full format and validation workflow](../chess-review-open-en/references/common-leaks.md). Assess every item in `plan.selected`. Reuse stable group IDs for the same mechanism. A repeated leak requires at least two distinct games; a single occurrence is a new finding. Record `none` when no credible issue exists.

Only use the user's own actual moves for leaks or progress. `actor: opponent` moments and hypothetical engine variations are not the user's performance. Higher average scores alone do not establish improvement or a repaired leak.

Show actual and suggested moves from the same starting position with short captions and one practice habit. Common leaks is the default tab; good moves and supported comparisons belong in the separate Progress tab. Preserve counterexamples and sample limitations; one success does not prove a habit is fixed.

Update the same `common-leaks.html`, verify it in a browser, then rebuild `index.html`. If there are no credible cases, retain assessment records and report the finding without inventing categories.

## Incremental updates

Once enabled, run this workflow after each newly completed review in the same user request. Pass only the new stems. One game can update an existing archive; the initial threshold does not block incremental work.

```sh
python "$REVIEW_SKILL_DIR/scripts/plan_common_leaks.py" chess-reviews --user CONFIRMED_USERNAME --stems NEW_REVIEW_STEM --out work/leaks-plan.json
python "$REVIEW_SKILL_DIR/scripts/build_leaks.py" chess-reviews --merge work/leaks-update.json
```

Deduplicate by stable game ID and teaching position, preserve existing cases and notes, and record games checked even when no new leak appears. Deliver a brief change summary and animated page, not another long text report. This is on-request agent work, not account polling or a cloud service. Default to local files; publish only on explicit user authorization to their own target.
