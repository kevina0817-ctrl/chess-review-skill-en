# Chess.com username import

Use the official read-only public API. No password, token or login is needed for public completed games. Read the locally saved `.chess-review-account.json`; ask for a username only when absent. A user's review request authorizes this retrieval, not playing games or changing settings.

```sh
python "$SKILL_DIR/scripts/fetch_chesscom.py" chess-reviews --user CONFIRMED_USERNAME --connect-only
python "$SKILL_DIR/scripts/fetch_chesscom.py" chess-reviews --user CONFIRMED_USERNAME
python "$SKILL_DIR/scripts/fetch_chesscom.py" chess-reviews
python "$SKILL_DIR/scripts/fetch_chesscom.py" chess-reviews --count 3
```

Connection-only validates the profile and remembers it even if there are no games; it does not review. Review requests default to one game, with 1–5 only when explicitly requested. Use `--timezone` only for a confirmed IANA timezone, otherwise UTC start date. Separate different users' folders.

The helper retrieves archives sequentially, newest months first, bounded to 6 months and 120 seconds. Select completed standard games by greatest `end_time`, not array order, and validate PGN. Save source data under `work/chesscom/`. Retrieval is not a finished review: continue validation, engine analysis, teaching, HTML generation and archiving.

Determine color from every PGN; use PGN start date/time, not `end_time`, for naming. Match game IDs across URL forms and player/move signatures to avoid duplicates. If the newest game is already reviewed, give its existing review; do not substitute an older unreviewed game. Explicit opponent/date requests need exact lookup, not blindly using the latest-N helper.

Public archives can lag. If a just-finished game is missing or the result is stale, inspect completed-game history using available browser tools and retrieve PGN through the site. Let the user log in if necessary; never request their password or verification code. Report partial results, no public games or network errors honestly. Bound retries for 403/429 errors; do not create background polling.

Account preferences, private PGNs and browser notes never belong in public plugin examples. API reference: https://www.chess.com/news/view/published-data-api
