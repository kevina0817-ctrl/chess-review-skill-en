# 3.1 move counts, evaluations, threats and openings

Run `analyze_game.py` and pass its output as `build_review.py --analysis analysis.json`. The game fingerprint, every UCI move, turn and FEN must match. Position evaluations are normalized to White's perspective. Deeper results supersede screening results. Without an engine, omit analysis and show unavailable data; never invent numbers.

Lessons use `actor: "user"` (default) or `"opponent"`; the builder checks the actual turn. Mark good moves `positive: true`. An engine first choice is not automatically brilliant. Explain the concrete problem it solves, and reserve blunder claims for meaningful loss supported by deeper analysis. Opponent mistakes are opportunities, not evidence of the user's improvement.

## Count and chart definitions

- Do not calculate or display accuracy-style totals, phase scores, per-move ratings or their tooltips. Cards show each side's total moves, blunders, mistakes and verified good moves.
- Total moves counts actual moves by that side, not full-move numbers. Good moves count distinct `positive: true` actual lessons by real color and `ply`. Only verified included examples count; zero does not mean no good moves were played. An engine first choice alone is not a good-move example.
- White cp maps to an index `100 / (1 + exp(-0.00368208 * cp))`. This visualizes the position; it is not accuracy or the player's actual winning probability.
- Let delta be the mover's index loss, floored at zero. Delta >= 20 is a blunder; 10 <= delta < 20 is a mistake; 5 <= delta < 10 is an inaccuracy. Blunders and mistakes do not overlap. These are this tool's thresholds, not another platform's classifications. The mapping saturates in very unequal positions, so counts cannot replace explanations of key moments.
- Mate is shown separately as M, never as an artificial pawn value. Rules confirm terminal positions; a rules-based draw maps to 50, and checkmate maps to the winner's extreme.
- Retain exact FENs, depth, principal variations, the game fingerprint and analysis settings. Do not change the moves, teaching variations or per-game note keys.

## Chart and continuations

Clicking the chart opens actual replay. The bar looks up the current full FEN. Flipping changes placement, never the White-oriented sign. Unanalyzed practice or suggested positions show unavailable, not the previous position's evaluation.

Engine continuations contain up to 10 legal half-moves, clearly separate from actual play, with checks, captures and rules-confirmed mate markers. An engine M signal is a search result; only the terminal verified board is labeled checkmate. A check in a PV is not necessarily an unavoidable threat. Verify alternatives before calling a reply forced or unique.

## Opening study

The bundled CC0 named-position database matches the deepest actual EPD within the first 40 half-moves, including transpositions. A recognized historical position does not make subsequent moves correct. No match means no invented name. Add `opening_notes` tied to this game's center, development and king safety. Default resource links and verified topic links are provided; validate any extra article/video before adding it.

`examples/opera.pgn` and its config use the public 1858 [Opera Game](https://en.wikipedia.org/wiki/Opera_Game), not a user's private record. Analyze before building with `--analysis`. Its archive date is the demo generation date; the historical PGN date is retained.

Common leaks still requires 10 completed reviews and opt-in initially; existing archives update incrementally. Analytics does not alter permission or local-output rules.
