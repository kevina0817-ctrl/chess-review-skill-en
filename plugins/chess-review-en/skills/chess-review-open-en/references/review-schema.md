# Review JSON

Pass a normalized single-game PGN and UTF-8 JSON to the builder. See the example configs for complete field layouts. Rewrite all explanations for each new game.

Required teaching content: `user_color` (`white`/`black`), `intro`, `overview` (paragraph array), `strengths` (array), `training` (objects with `title`, `text`), `ending`, `provenance`, `date_note`, `review_guide`, and `lessons`. Set `archive_date` and a confirmed `timezone`; optional `notes_prompt` and `opening_notes` explain the actual matched opening's center, development and king safety. Do not guess names or hand-write scores.

Each lesson includes `ply`, `tag`, `title`, `summary`, `why`, `fix`, `habit`, `hint`, `actual_plies`, `better`, and optionally `actor`, `positive`, `assert_mate`, `accepted_moves`.

- `ply` counts half-moves before the teaching position. At a normal start, White's move n is `2*(n-1)`, Black's is `2*(n-1)+1`. Custom FENs count from their supplied start: use `positions.json`, not that formula.
- `actual_plies` defaults to 4 and truncates at the game's end. Actual moves are extracted from PGN, never fabricated.
- `better` is a legal SAN array without move numbers, starting at that exact position, e.g. `["Qb8+", "Nxb8", "Rd8#"]` for the matching Opera Game position.
- `actor` defaults to `user`; use `opponent` for opponent moments. The builder verifies whose turn it is. Judge good/bad play for the mover and explain how the user can respond.
- `positive: true` marks a good move; its suggested line may match actual play.
- `assert_mate: true` requires checkmate at the variation's end. Omitting the flag does not permit unverified mate claims in prose.
- `accepted_moves` lists verified alternatives as `{"san":"...","feedback":"Why this also works."}`. Other legal moves are described as legal but not this page's demonstration, not automatically wrong.
- Prose fields are plain text and escaped. Each array element is a paragraph. Explain concrete pieces and squares; supply one executable habit per lesson.
- `ending`, `provenance` and dates must match evidence. Do not infer resignation from 1-0, or claim engine use without running it.
- Names, ratings, time controls and source URLs come from PGN. Missing ratings stay missing; links permit HTTP(S) only.

Build in empty staging. If a distinct game has the same date/opponent, add `"filename_suffix": "02"` after checking the collision. HTML, PGN and download filenames then share the suffix. Only replace an existing review when revising that specific game.
