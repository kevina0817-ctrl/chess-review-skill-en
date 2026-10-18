# Quantified capability trends

Use this mode when the user asks for strengths and measurable progression. A collection of good moves is not a longitudinal measure. Add `capabilities` to the authorized rating configuration in the user's output directory:

```json
{"username":"CONFIRMED_USERNAME","cache_dir":"work/rating-cache","capabilities":{"pool":"rapid","engine":"/absolute/path/to/verified-stockfish","cache_dir":"work/capability-cache"}}
```

Resolve the existing bundled engine with `bundled_engine.py` or use a verified override. Keep caches in a local ignored work directory. First analysis of up to 60 games takes longer than one review; reuse the cache afterwards. Do not fetch unrelated accounts or run a scheduler.

`build_leaks.py` first refreshes rating history, then analyzes the latest 60 rated standard games in the selected pool, including wins, draws and losses, using the monthly cache. Fingerprints include method version, engine binary SHA-256, account and PGN. Changes to engine or method invalidate the cache; never mix methods across groups.

- Compare separate consecutive groups of 20 games. Do not compare unequal or partial groups; fewer than three complete groups cannot establish sustained improvement.
- Clear errors: the user's moves with comparable finite evaluations losing at least 200 centipawns. Use one thread, Hash 64, 40,000 nodes; refine candidates losing at least 150 centipawns at 200,000 nodes. Exclude mate scores from the finite-evaluation denominator. This differs from the single-game chart's categories and is not accuracy.
- Mate-in-one opportunities: enumerate legal moves; success means the actual move checkmates.
- Defensive opportunities: the player is not in check, the opponent threatens mate next move, and a legal move prevents that mate. Count whether the played move prevents it. Unavoidable mates and longer forced lines are excluded.
- Show numerator, denominator and distinct games. Several opportunities in one game are not independent evidence across many games.
- Phases are moves 1–10, 11–25 and 26 onward; do not automatically call the last phase an endgame.
- The interface describes continuous improvement only with three eligible groups changing in the same direction, with at least 2 fewer errors per 100 moves or a 10 percentage-point improvement from first to last. Error groups require 200 moves and 10 games; opportunity groups require 8 opportunities and 5 games. These are display thresholds, not significance tests or proof of mastery. Opponent and position difficulty are not adjusted.
- Summarize a relative strength, observed changes and a next practice action. Remove the legacy good-move list from the visible Growth page; preserve its data and individual game lessons. Ratings remain a separate result measure. Changing the rating-chart pool does not change the capability sample.
- On source or engine failure, retain the previous complete analysis and mark it stale. Do not substitute a partially analyzed set or make new progress claims.

The cross-game page must already exist under the common-leaks workflow; its initial ten-reviewed-game gate is unchanged. Test exact tactical observations, denominators, empty/small/stale samples, legacy preservation, desktop/mobile/offline behavior and navigation. Use synthetic data only in explicitly labeled demos, never as a user's analysis.
