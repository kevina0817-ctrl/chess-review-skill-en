# 3.0 analytics, threats and openings

Run `analyze_game.py` and pass its output as `build_review.py --analysis analysis.json`. The game fingerprint, every UCI move, turn and FEN must match. Scores are normalized to White's perspective. Deeper results supersede screening results. Without an engine, omit analysis and show unavailable data; never invent numbers.

Lessons use `actor: "user"` (default) or `"opponent"`; the builder checks the actual turn. Mark good moves `positive: true`. An engine first choice is not automatically brilliant. Explain the concrete problem it solves, and reserve blunder claims for meaningful loss supported by deeper analysis. Opponent mistakes are opportunities, not evidence of the user's improvement.

## Score definitions

- White cp maps to an index `100 / (1 + exp(-0.00368208 * cp))`. This is a visualization, not this player's actual win probability.
- Let delta be the mover's index loss, floored at zero. Per-move score is `clamp(103.1668 * exp(-0.04354 * delta) - 3.1669, 0, 100)`; no loss scores 100.
- Overall and phase scores are arithmetic means of each side's moves. The formula references [Lichess's per-move formula](https://lichess.org/page/accuracy), but does not copy its game aggregation. Do not call it platform accuracy or Elo.
- Delta >= 20 / 10 / 5 is this plugin's blunder / mistake / inaccuracy threshold, not another platform's classification. The mapping saturates in very unequal positions, so high averages can conceal serious mistakes.
- Average pawn loss includes only pairs with cp before and after. Mate is shown separately as M, never as the artificial ranking extreme. Rules confirm terminal positions; a rules-based draw maps to 50.
- Endgame heuristic: combined non-pawn material <= 13, or no queens and <= 26 (minor pieces 3, rooks 5, queens 9). Otherwise first 10 moves are opening, then middlegame. Missing phases show no sample.
- Always show samples, events and positions alongside averages. Search time/depth affect data; do not compare tiny differences under different settings.

## Chart and continuations

Clicking the chart opens actual replay. The bar looks up the current full FEN. Flipping changes placement, never the White-oriented sign. Unanalyzed practice or suggested positions show unavailable, not the previous position's evaluation.

Engine continuations contain up to 10 legal half-moves, clearly separate from actual play, with checks, captures and rules-confirmed mate markers. An engine M signal is a search result; only the terminal verified board is labeled checkmate. A check in a PV is not necessarily an unavoidable threat. Verify alternatives before calling a reply forced or unique.

## Opening study

The bundled CC0 named-position database matches the deepest actual EPD within the first 40 half-moves, including transpositions. A recognized historical position does not make subsequent moves correct. No match means no invented name. Add `opening_notes` tied to this game's center, development and king safety. Default resource links and verified topic links are provided; validate any extra article/video before adding it.

`examples/opera.pgn` and its config use the public 1858 [Opera Game](https://en.wikipedia.org/wiki/Opera_Game), not a user's private record. Analyze before building with `--analysis`. Its archive date is the demo generation date; the historical PGN date is retained.

Common leaks still requires 10 completed reviews and opt-in initially; existing archives update incrementally. Analytics does not alter permission or local-output rules.
