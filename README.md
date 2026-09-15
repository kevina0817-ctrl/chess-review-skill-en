# Chess Review Open — English Edition

Give a PGN from a game you just played to your AI coding assistant and get an **interactive chess review webpage**: which moves mattered, what you could have played, and a chance to try the moves yourself on the board. English commentary, offline access, and no website registration required.

Designed for AI assistants that support the Agent Skills (`SKILL.md`) format, including Codex, Claude Code, and Kimi. This is the English edition of Chess Review Open, with the same workflow and offline interface. The skill, documentation, templates, examples, and generated interface are all in English.

## Quick installation

Open a terminal and run this command to download the skill, including Stockfish:

```bash
git clone https://github.com/kevina0817-ctrl/chess-review-skill-en.git
```

Or choose **Code → Download ZIP** on this page and extract it.

Copy the `skills/chess-review-open-en` folder into your AI assistant's skills directory. Or keep the downloaded repository in your project and tell your assistant:

> Review my game using `chess-review-skill-en/skills/chess-review-open-en/SKILL.md`.

You need Python 3.10 or later. Stockfish is already included, and your assistant can install the required Python package on first use. For optional manual setup, see the [setup guide](skills/chess-review-open-en/references/workflow.md#dependencies).

## How to use it

1. **Copy the PGN.** Export a completed game from your chess website or app. On Chess.com, look for Share and PGN; on Lichess, look for FEN & PGN on the game page.
2. **Give it to your assistant and state your side.** For example:

   > Use chess-review-open-en to review this game. I played Black. Explain the key mistakes and better moves in English, and generate an interactive webpage.
   >
   > [Paste the complete PGN here.]

3. **Open the webpage.** The assistant generates `chess-reviews/YYYY-MM-DD_OPPONENT.html` in your project. Open it in a browser. Future games are collected in the same `chess-reviews/index.html` library.

## Features

**Start with the moves that matter most.** A game may last dozens of moves, while only a few positions deserve your immediate attention. A review usually selects 4–8 evidence-backed teaching points: where the position first went wrong, when material was actually lost, or where a mate in one was available. Short games may need fewer lessons.

Instead of requiring you to discover the teaching points by stepping through an evaluation graph, the review identifies them first. You can then examine and practice those positions.

**Key moments: played move vs. better move.** Each lesson explains the reason in plain English, draws arrows on the board, and lets you compare actual play with a verified alternative.

![Key moments: the better move](docs/screenshots/lesson-better.png)

**Try a move.** Hide the answer and choose a move from the game's position. The page checks legality, compares your choice with the prepared examples, and offers a hint. Other legal moves are not automatically labeled wrong.

![Trying a move and receiving feedback](docs/screenshots/practice.png)

**Full replay.** Step forward or backward, autoplay the moves, flip the board, and download the PGN to continue studying elsewhere.

![Full game replay](docs/screenshots/replay.png)

**Review library.** Keep games together by date in one webpage. Search opponents, filter by White or Black, and interact with every review.

![Review library](docs/screenshots/library.png)

**Mobile access.** Each review is a single HTML file. Transfer it to your phone and open it in a browser, including offline.

<img src="docs/screenshots/mobile.png" alt="English chess review on a mobile screen" width="360">

Open the included [demo library](docs/demo/index.html) locally to try both fictional examples. GitHub displays HTML source; download the repository and open the file in your browser to interact with it.

## How it compares

| | Asking AI in chat | Chess website analysis | This skill |
|---|---|---|---|
| Explanation | Text in the conversation | Engine evaluations and move annotations | English commentary for your side, with specific pieces, squares, and consequences |
| Validation | Depends on the assistant's tools | Engine analysis | Rules-checked moves and Stockfish evidence for key positions |
| Practice | Depends on the chat workflow | Varies by website and feature | Try a move in each selected teaching position |
| Files | Stored in the conversation | Managed by the website | HTML files on your computer, usable offline and shareable |

## How it works

```text
Paste a PGN → Scripts validate every move → Bundled Stockfish analyzes positions
→ The AI assistant selects teaching points and writes English commentary
→ Build and check a self-contained HTML page → Update the review library
```

The AI assistant writes the explanations from engine evidence; the engine does not write the prose. Stockfish runs locally during analysis. The generated webpage does not need an engine or a network connection. The skill has no server or automatic game-upload service.

## Input and output

**Input:** Standard chess PGN text, such as `1. e4 e5 2. Nf3 Nc6 ...`, with or without headers such as `[Event ...]`. PGN files and clear screenshots of moves are also supported. Tell the assistant whether you played White or Black. If you provide your username, it can match it against that game's PGN tags.

**Output:** Three kinds of files in `chess-reviews/`:

- `YYYY-MM-DD_OPPONENT.html`: the game's interactive review.
- `YYYY-MM-DD_OPPONENT.pgn`: the normalized game for importing into other software.
- `index.html`: the library entry point, updated as reviews are added.

Personal notes are stored in the current browser and can be exported. They are not uploaded automatically. Original PGN data, including player names and game metadata, is preserved; the English edition translates the interface and review commentary.

## Repository layout

```text
skills/chess-review-open-en/
  SKILL.md              Assistant workflow
  agents/openai.yaml    English skill metadata
  scripts/              PGN validation, engine analysis, builders, browser checks
  assets/               English single-game and library HTML templates
  vendor/stockfish/     Official Stockfish 19 for macOS, Windows, and Linux
  references/           Workflow guide and review data schema
  examples/             Two fictional teaching examples
  LICENSE               License for the skill's own files
  NOTICE.md             Third-party notices
docs/demo/              Ready-to-open English demo library and reviews
docs/screenshots/       English interface screenshots
tests/                  Bundled-engine regression checks
```

See the [workflow guide](skills/chess-review-open-en/references/workflow.md) for build commands and browser checks, and the [review schema](skills/chess-review-open-en/references/review-schema.md) for writing commentary data. Browser checks additionally need Node.js 18+, Playwright, and Chromium; viewing finished pages needs only a browser.

## License

The engine archives are included, so no separate Stockfish download is needed. Install the Python dependency before generating reviews.

This project's own scripts, webpage templates, documentation, and examples use [PolyForm Noncommercial 1.0.0](LICENSE). They may be used, modified, and shared free of charge for **noncommercial purposes**, including personal study, hobbies, teaching, schools, and nonprofit organizations. Commercial use requires separate written permission from Mission Nine Lab Inc.

Bundled Stockfish, separately installed python-chess, and the chess piece artwork are third-party works with their own licenses. The project's noncommercial restriction does not apply to those components. See the [third-party notices](skills/chess-review-open-en/NOTICE.md).
