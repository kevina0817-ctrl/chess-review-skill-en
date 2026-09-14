# Review Data Schema

The build command takes one normalized PGN game and a UTF-8 JSON file. The following example illustrates fields only. Rewrite the text and variations for each new game; never reuse conclusions from an earlier game.

```json
{
  "archive_date": "2000-01-01",
  "timezone": "America/Toronto",
  "user_color": "white",
  "intro": "The main habit to improve in this game is checking for recaptures before taking material.",
  "overview": ["Describe the game using the evidence from its positions."],
  "strengths": ["Identify specific good moves and explain why they worked."],
  "training": [{"title": "Check recaptures first", "text": "Before every capture, identify opposing pieces that attack the destination square."}],
  "notes_prompt": "What did I see at the time, and what did I overlook?",
  "review_guide": "After importing the PGN, pause at each key move and choose a move independently before comparing.",
  "ending": "Describe the actual ending. Do not infer resignation, timeout, or checkmate from the result alone.",
  "provenance": "Accurately state the engine and scope of validation, or label the analysis as manual.",
  "date_note": "Explain the archive date and the original PGN date.",
  "lessons": [{
    "ply": 14,
    "tag": "Lost material",
    "title": "Check the opponent's rook before taking the pawn",
    "summary": "Describe this key position in one sentence.",
    "why": "Explain the problem with the played move and its actual consequences.",
    "fix": "Explain the better move using specific pieces and squares.",
    "habit": "Give one practical check to use in the next game.",
    "hint": "Offer a hint without revealing the full answer.",
    "actual_plies": 2,
    "better": ["Nc3"],
    "positive": false,
    "assert_mate": false,
    "accepted_moves": []
  }]
}
```

## Indexing and variations

- `ply` is the number of completed half-moves before the teaching position; the starting position is `0`. From the standard initial position, White's move n starts at `2*(n-1)` and Black's move n at `2*(n-1)+1`.
- With a custom FEN, count from the supplied starting position instead of applying the standard formula. Verify each entry against `positions.json`. The scripts derive the actual move number and side to move from the position.
- `actual_plies` controls how many actual half-moves to display (default: 4). It is automatically truncated at the end of the PGN. Do not fabricate played variations.
- `better` is an array of SAN moves without move numbers, such as `["Rf8#"]`. Every variation starts at the real position for that `ply`.
- `positive: true` identifies a good move worth keeping. The demonstration may then match actual play.
- `assert_mate: true` requires the better line's final position to be checkmate. Omitting it does not permit unverified checkmate claims in the commentary.
- `accepted_moves` may list other verified, reasonable first moves, such as `[{"san":"...","feedback":"Explain why this move is also reasonable."}]`. By default, only the main demonstration is accepted. Other moves receive “legal, but not the example on this page” feedback rather than being automatically labeled wrong.
- All prose fields are plain text and are escaped by the builder. Each paragraph-array element renders as one paragraph. Write the prose in English.
- `date_note`, `provenance`, and `ending` must agree with the actual evidence. The page does not claim Stockfish was used by default, and it does not infer resignation from 1-0.
- Do not supply names, ratings, time controls, or original game URLs in the review JSON; these come from the PGN. Missing ratings are hidden, and URLs must use HTTP(S). Do not invent data to fill the interface.

## File conflicts

The normal filename combines the archive date and opponent. Generate into an empty staging directory, validate, then deliver. If the destination already contains a different game against the same opponent on the same date, verify the conflict and add `"filename_suffix": "02"` to the review JSON. This appends `_02` to the HTML, PGN, and webpage download filenames together. If the user explicitly requests a correction to an existing page, build and validate in staging before replacing that specific file.
