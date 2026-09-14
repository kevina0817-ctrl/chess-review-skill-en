# Running and Validating Reviews

## Dependencies

Python 3.10+ and the `chess` Python package (from the python-chess project) are required. Stockfish 19 is included in `vendor/stockfish/`. Browser checks additionally require Node.js 18+, Playwright, and Chromium. Generating a webpage does not require Node.js; viewing the result does not require Python or Stockfish.

Create an isolated Python environment in any project working directory. In the commands below, set `SKILL_DIR` to the installed skill folder's actual path on the current machine.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r "$SKILL_DIR/requirements.txt"
```

On Windows, replace `.venv/bin/python` with `.venv\Scripts\python.exe`. If the host already provides working dependencies, use them directly without replacing the global environment.

The package includes official Stockfish 19 distributions for macOS universal, Windows x86-64/ARM64, and Linux x86-64/ARM64. Keep the entire skill folder intact, especially `vendor/stockfish/`. The scripts select the matching archive, verify its SHA-256 checksum, and extract it automatically. Users do not need to download the engine separately. The original archives also retain upstream source code, build scripts, and licenses.

The default cache is `engine-cache/` beside the analysis output JSON. Set another writable location with `--engine-cache`. To check the local engine in advance, run `python scripts/bundled_engine.py --verify` from the skill folder; its default cache is `work/engine-cache/` under the current directory. Unsupported architectures produce an explicit error and may use `--engine /actual/path/to/engine` as an override. Nothing is silently downloaded.

## Validation and analysis

```sh
.venv/bin/python "$SKILL_DIR/scripts/prepare_game.py" game.pgn --out-dir work/prepared
.venv/bin/python "$SKILL_DIR/scripts/analyze_game.py" work/prepared/normalized.pgn --perspective black --out work/analysis.json
```

`--perspective` must match the side confirmed for this game. By default, each position receives 0.3 seconds of analysis; up to eight moves most worth reviewing receive another 1.5 seconds on both the before and after positions. Increase the time or examine several candidates for complex tactics. `rank_score` uses extreme values internally to rank mating positions; do not display it as a normal evaluation.

The PGN parser may ignore meaningless characters, so still compare the move count and order with the original input. For multiple games, explicitly select an index such as `--game 0`. For a position alone, use validated SetUp/FEN tags without inventing prior moves.

## Generation and archiving

The agent writes `review.json` from the engine results; the scripts do not automatically write natural-language commentary. See `review-schema.md` for the fields. Write all commentary in English.

```sh
.venv/bin/python "$SKILL_DIR/scripts/build_review.py" work/prepared/normalized.pgn work/review.json --out-dir work/site-staging
```

The builder validates teaching lines, the player's side, and checkmate labels, and refuses to silently overwrite existing HTML. After validation, move the finished HTML and PGN into the chosen output folder (default: `chess-reviews/`) and run:

```sh
.venv/bin/python "$SKILL_DIR/scripts/build_library.py" chess-reviews
```

The entry point embeds all reviews. The builder scans only top-level HTML files named by date, skipping symlinks and working directories. It preserves historical games already in the entry point and updates corrected versions with the same filename. It refuses to overwrite an `index.html` outside this format. Use unique filenames for different games.

## Browser checks

Install testing dependencies in the task's working directory:

```sh
npm install --no-save playwright
npx playwright install chromium
node "$SKILL_DIR/scripts/check_review.cjs" work/site-staging/DATE_OPPONENT.html work/qa
node "$SKILL_DIR/scripts/check_library.cjs" chess-reviews/index.html work/library-qa
```

If the host already provides a browser and Playwright, set `CHESS_REVIEW_PLAYWRIGHT` to the Playwright package path and `CHESS_REVIEW_BROWSER` to the browser executable. Both paths depend on the current machine. The checkers can also find dependencies in the current working directory's `node_modules`.

Check all key moves and legal move practice, full replay, downloads, note isolation, and desktop/narrow layouts. Inspect desktop and mobile screenshots to ensure that the pieces and English text are readable without overlaps. The library checker creates an isolated copy and does not modify the user's actual browser notes.

## Reproducible examples

`examples/black.pgn` and `examples/white.pgn` are fictional teaching records. Their accompanying review JSON files are manually written and do not claim engine analysis. Build them directly to check the template, or run engine analysis separately. Never apply example conclusions to a real game.

## Public sharing

The skill accepts standard PGN without depending on a specific chess website. It delivers files by default, and they can be opened offline. Uploading generated pages to static hosting requires the user's own authorization and configuration. The skill has no server, account login, or automatic upload service; an AI assistant runs the workflow in the user's environment.
