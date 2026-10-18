# Optional Chess.com rating history

When the user requests rating tracking, use the official read-only public API. No password is needed. Fetch during requested review updates, never in the HTML or through a background monitor.

Create `.chess-review-ratings.json` in the user's review output directory; do not ship this local configuration:

```json
{"username":"CONFIRMED_USERNAME","cache_dir":"work/rating-cache"}
```

The account must match the archive's `user`. On each ordinary `build_leaks.py OUTPUT_DIR` run, including updates without new cases, fetch archives, every monthly archive and stats sequentially. No configuration means no network request. `--export` is read-only; `--skip-rating-sync` only rebuilds an old snapshot for offline use or testing.

Initial synchronization failure stops the build when no complete snapshot exists. Later failure preserves the previous snapshot and timestamp, visibly marked stale. Only a complete request sequence replaces `history.json`; partial monthly results are not advertised as complete history. Official archives may lag recent games.

- Separate rapid, blitz, bullet and daily pools. Include unreviewed games. Keep raw completed history, but exclude unrated games and nonstandard variants from the standard rating curve.
- Use each archived player's post-game `rating`, as documented in the [official API](https://www.chess.com/news/view/published-data-api). Order by `end_time`; do not infer start time from it.
- Current rating comes from `stats.last`; selected-period change is last minus first record. “Highest in period” is not a lifetime best. Missing ratings remain missing.
- Adjacent differences may include adjustments or caching effects, not just one game's result. A rating increase does not prove mastery of a skill.
- Preserve `#progress`, `#positive-section`, Home navigation and the default Common leaks view. With capability analysis enabled, show its summary before ratings and remove the old good-move list from the interface while retaining its data.

Test sequential fetching, all-or-nothing history, unknown/missing results, pool and period controls, empty ranges, stale snapshots, mobile and offline rendering. Preserve prior cases, reviews and note keys. Run full browser regression when templates change.
