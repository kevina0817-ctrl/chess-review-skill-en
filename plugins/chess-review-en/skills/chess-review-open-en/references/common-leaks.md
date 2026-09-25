# Common-leaks format and validation

Use one stable `common-leaks.html`, with embedded `visual-data` as its canonical archive. Default to Common leaks; Progress is a separate tab. Preserve keyboard controls, deep links and existing notes.

## First-run gate and batches

At least 10 distinct completed HTML+PGN reviews for the same player are required, plus opt-in. Raw downloads do not count. `plan_common_leaks.py --enable` records consent only when authorized; `--disable` preserves the archive. Initially inspect the latest 10 reviews and assess every selected game. Budget 25 minutes plus 5 for validation, with an 8–20 minute estimate, not a guarantee. Defer additional history. Reuse engine results.

```sh
python "$SKILL_DIR/scripts/plan_common_leaks.py" chess-reviews --user USER --enable --out work/leaks-plan.json
python "$SKILL_DIR/scripts/build_leaks.py" chess-reviews --user USER --plan work/leaks-plan.json --merge work/leaks-update.json
```

Once enabled, pass only newly completed stems to the planner (maximum 5 per batch by default). A `specify_new_games` status means identify new stems, not rerun history. Incremental builds do not require re-enabling.

## Update JSON

- `groups`: stable `id`, `title`, `short`, `desc`, `habit`. Reuse a category for the same mechanism. Two distinct games establish repeated occurrence; one is a new finding.
- `cases`: `stem`, `ply`, `group_id`, `title`, `contrast: {actual, better}`, `captions: {actual: [...], better: [...]}`. Each caption array includes the starting frame, then one caption per half-move. Actual and suggested lines come from the selected verified lesson and must share the same starting FEN.
- Optional `arrows` is keyed by branch and frame number, e.g. `{"actual":{"0":[["h5","f7"]]}}`. Optional `threat` includes legal `moves` and `captions`, clearly labeled hypothetical.
- `assessments`: one per selected stem, `outcome` of `new`, `existing` or `none`, plus an evidence-based `note`. Never invent a leak to fill a quota.
- `progress`: `kind` (`good_move`, `comparison`, `repeated`), `title`, `skill`, `explanation`, `habit`, `limit`, `current` and, where applicable, `prior`. Each reference includes `stem`, `ply`, `captions`. Current evidence must be a positive user lesson; comparisons require chronological, comparable actual evidence. Repeated successes require multiple real positive records.

Only the user's actual moves qualify as leaks or progress. Opponent lessons and suggested variations cannot count. Retain contrary evidence and limits; one success or a higher reference score does not prove a leak is fixed. Explain improvement only when comparable opportunities support it.

## Merge and verify

Use `--export` to inspect the existing canonical payload, then `--merge` to preserve old cases. Use `--replace-cases` only for deliberate corrections. Deduplicate stable game/position identities. Validate all SAN, frame counts, turns, chronology and mate claims. Every case needs a concrete explanation and one practical habit.

```sh
python "$SKILL_DIR/scripts/build_leaks.py" chess-reviews --merge work/leaks-update.json
node "$SKILL_DIR/scripts/check_leaks.cjs" chess-reviews/common-leaks.html work/leaks-qa
python "$SKILL_DIR/scripts/build_library.py" chess-reviews
```

Inspect screenshots, mobile layout and both animation paths. No credible cases means retain assessment work and report the finding, not fabricate categories. Deliver the animated archive with a brief change summary, rather than a separate long text report. Output stays local unless the user explicitly authorizes their own publishing target. Never upload to the plugin source repository.
