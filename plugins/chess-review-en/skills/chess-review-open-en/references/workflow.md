# Runtime and validation

Use Python 3.10+ and the `chess` package (python-chess). Browser QA additionally uses Node.js 18+, Playwright and Chromium. Viewing output needs only a browser. Reuse an available runtime; otherwise create a project-local virtual environment and install the skill's requirements. Do not overwrite global dependencies.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r "$SKILL_DIR/requirements.txt"
```

On Windows use `.venv\Scripts\python.exe`. Resolve `SKILL_DIR` on the current machine. Keep bundled `vendor/stockfish/` intact: official Stockfish 19 for macOS universal, Windows x86-64/ARM64 and Linux x86-64/ARM64. Archives include source, build scripts and licenses. The helper verifies SHA-256 and selects the local platform. Default cache is `engine-cache/` beside analysis output; override with `--engine-cache`. `bundled_engine.py --verify` verifies the local engine, defaulting to `work/engine-cache/`. Unsupported architectures require an explicit `--engine` path; no silent download.

For username requests follow [import](chesscom-import.md), defaulting to one game. Then validate and analyze:

```sh
python "$SKILL_DIR/scripts/prepare_game.py" game.pgn --out-dir work/prepared
python "$SKILL_DIR/scripts/analyze_game.py" work/prepared/normalized.pgn --perspective black --out work/analysis.json
```

Use this game's confirmed side. Defaults: 0.3 seconds per position; deepen before/after positions for up to 8 candidates per side for 1.5 seconds. Increase time for difficult tactics. Internal mate `rank_score` is not a display score. Compare parsed moves with input because parsers may skip meaningless characters. Select multi-game inputs explicitly with `--game 0`, etc. Validate SetUp/FEN starts; never invent prior moves.

Write `review.json` using [schema](review-schema.md) and evidence, then:

```sh
python "$SKILL_DIR/scripts/build_review.py" work/prepared/normalized.pgn work/review.json --analysis work/analysis.json --out-dir work/site-staging
```

Scores, charts, bars and engine continuations come from matching complete analysis. Old files without a game fingerprint must be reanalyzed; never forge the fingerprint. Omit `--analysis` for honest manual-only reviews; missing scores are shown as unavailable. See [analytics](analytics.md).

The builder validates branches, color and mate flags and rejects silent HTML overwrites. After checks copy final HTML and PGN into the output folder and run:

```sh
python "$SKILL_DIR/scripts/build_library.py" chess-reviews
```

The index embeds reviews, scans dated top-level HTML and skips symlinks/work folders. It preserves existing embedded games and updates same-name revisions, and refuses unrelated index files. Distinct games need distinct filenames.

## Browser checks

Use available dependencies or install Playwright in the task workspace:

```sh
npm install --no-save playwright
npx playwright install chromium
node "$SKILL_DIR/scripts/check_review.cjs" work/site-staging/DATE_OPPONENT.html work/qa
node "$SKILL_DIR/scripts/check_insights.cjs" work/site-staging/DATE_OPPONENT.html work/insights-qa
node "$SKILL_DIR/scripts/check_library.cjs" chess-reviews/index.html work/library-qa
```

Run insights checks for pages with engine analysis. `CHESS_REVIEW_PLAYWRIGHT` may point to an existing package and `CHESS_REVIEW_BROWSER` to a browser executable. Check all lessons, legal practice, replay, downloads, notes isolation, desktop/mobile layout; inspect screenshots for readable pieces and text. Test in an isolated browser profile.

`examples/white.pgn` and `black.pgn` are fictional teaching games with manually written configs; they make no engine claim. `opera.pgn` is the public 1858 Opera Game; analyze it and build with `opera-review.json` for the 3.0 historical demo. Never reuse example conclusions for a new game.

Default output is local and offline. No automatic commit, push or deployment; source repository URLs are not upload targets. The user must explicitly authorize publishing to their own destination. The companion common-leaks skill is optional: after 10 completed reviews and opt-in, update incrementally. The library preserves its link.
