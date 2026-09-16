# Chess Review Open

Turn your chess games into **interactive reviews** with your AI assistant. See where things went wrong, explore better moves, and try them on the board. Open the review in your browser and use it offline—no account needed.

Works with AI assistants that support Agent Skills (`SKILL.md`), including Codex, Claude Code, and Kimi.

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

   > Use chess-review-open-en to review this game. I played Black. Show me what I missed and what I could have played instead. Create an interactive review.
   >
   > [Paste the complete PGN here.]

3. **Open the webpage.** The assistant generates `chess-reviews/YYYY-MM-DD_OPPONENT.html` in your project. Open it in a browser. Future games are collected in the same `chess-reviews/index.html` library.

## Features

**Find the key moments.** Jump straight to mistakes, missed chances, and good moves, with clear explanations of why they mattered.

**Compare your options.** Switch between the move you played and a better alternative. Follow the arrows to see how each line plays out.

![Key moments: the better move](docs/screenshots/lesson-better.png)

**Try it yourself.** Revisit a position and find your own move before revealing the answer. Get a hint if you're stuck.

![Trying a move and receiving feedback](docs/screenshots/practice.png)

**Replay the game.** Step through the moves or press play. Flip the board to see the other side, or download the PGN to study elsewhere.

![Full game replay](docs/screenshots/replay.png)

**Keep your reviews together.** Browse past games by date, search for an opponent, or filter by the side you played.

![Review library](docs/screenshots/library.png)

**Take it with you.** Each review is a single HTML file. Open it on your computer or phone, even without an internet connection.

<img src="docs/screenshots/mobile.png" alt="Chess review on a phone" width="360">

**Try the demo:** Download the repository and open `docs/demo/index.html` in your browser. It includes two sample games. The GitHub file view won't run the interactive page.

## How it compares

| | Asking AI in chat | Chess website analysis | This skill |
|---|---|---|---|
| Explanation | Text in the conversation | Engine evaluations and move annotations | Explains your options and what happens next |
| Validation | Depends on the assistant's tools | Engine analysis | Moves checked for legality; key positions analyzed with Stockfish |
| Practice | Depends on the chat workflow | Varies by website and feature | Try moves from the game's key moments |
| Files | Stored in the conversation | Managed by the website | HTML files on your computer, usable offline and shareable |

## How it works

The skill checks your PGN and analyzes the game with the bundled Stockfish engine. Your AI assistant uses that analysis to explain the key moments and build an interactive review.

Stockfish runs on your computer while the review is being created. The finished page works offline. Practice uses the reviewed moves and hints; it doesn't run a live engine.

## Input and output

**Input:** Standard chess PGN text, such as `1. e4 e5 2. Nf3 Nc6 ...`, with or without headers such as `[Event ...]`. PGN files and clear screenshots of moves are also supported. Tell the assistant whether you played White or Black. If you provide your username, it can match it against that game's PGN tags.

**Output:** Three kinds of files in `chess-reviews/`:

- `YYYY-MM-DD_OPPONENT.html`: the game's interactive review.
- `YYYY-MM-DD_OPPONENT.pgn`: the normalized game for importing into other software.
- `index.html`: the library entry point, updated as reviews are added.

Your notes stay in your browser and can be exported. Original player names and game details are preserved.

## Repository layout

```text
skills/chess-review-open-en/
  SKILL.md              Assistant workflow
  agents/openai.yaml    Skill metadata
  scripts/              PGN validation, engine analysis, builders, browser checks
  assets/               Review and library HTML templates
  vendor/stockfish/     Official Stockfish 19 for macOS, Windows, and Linux
  references/           Workflow guide and review data schema
  examples/             Two fictional sample games and reviews
  LICENSE               License for the skill's own files
  NOTICE.md             Third-party notices
docs/demo/              Ready-to-open demo library and reviews
docs/screenshots/       Interface screenshots
tests/                  Bundled-engine regression checks
```

See the [workflow guide](skills/chess-review-open-en/references/workflow.md) for build commands and browser checks, and the [review schema](skills/chess-review-open-en/references/review-schema.md) for writing commentary data. Browser checks additionally need Node.js 18+, Playwright, and Chromium; viewing finished pages needs only a browser.

## License

This project's own scripts, webpage templates, documentation, and examples use [PolyForm Noncommercial 1.0.0](LICENSE). They may be used, modified, and shared free of charge for **noncommercial purposes**, including personal study, hobbies, teaching, schools, and nonprofit organizations. Commercial use requires separate written permission from Mission Nine Lab Inc. Contact: [info@mission9lab.com](mailto:info@mission9lab.com).

Bundled Stockfish, separately installed python-chess, and the chess piece artwork are third-party works with their own licenses. The project's noncommercial restriction does not apply to those components. See the [third-party notices](skills/chess-review-open-en/NOTICE.md).
