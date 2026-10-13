# Tools

A collection of eleven browser tools and games for writing, comparing text, and playing together. Each tool has its own guide with instructions, features, requirements and developer checks.

## Tool Directory

| Tool | Purpose | Open locally | Guide |
| --- | --- | --- | --- |
| **Text Compare** | Compare two versions of text or code and export the changes. | [Open](Text-Compare/index.html) | [README](Text-Compare/README.md) |
| **ChatGPT Splitter** | Turn long text into editable messages with a sequential copying workflow. | [Open](ChatGPT%20Splitter/index.html) | [README](ChatGPT%20Splitter/README.md) |
| **30 Second Drawing Game** | Draw the same prompt on paper, race the timer, and choose a winner together. | [Open](30%20Second%20Drawing%20Game/30sDrawingGame.html) | [README](30%20Second%20Drawing%20Game/README.md) |
| **Infinite Tic Tac Toe** | Play a strategic Tic Tac Toe variant where your oldest marks leave the board. | [Open](Infinite%20Tic%20Tac%20Toe/index.html) | [README](Infinite%20Tic%20Tac%20Toe/README.md) |
| **Passing the Parcel Game** | Host a physical party game or a labelled on-screen parcel simulation. | [Open](Passing%20the%20Parcel%20Game/PassingTheParcel.html) | [README](Passing%20the%20Parcel%20Game/README.md) |
| **गीतकारिका Text Editor — Lyricist Studio** | Write and organize verses, notes and ideas in a local section-based studio. | [Open](%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html) | [README](%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/README.md) |
| **JSON Formatter & Viewer** | Format, validate and explore JSON without rounding numeric literals. | [Open](JSON%20Formatter%20%26%20Viewer/index.html) | [README](JSON%20Formatter%20%26%20Viewer/README.md) |
| **Regex Tester** | Test JavaScript patterns, captures and replacements in an isolated worker. | [Open](Regex%20Tester/index.html) | [README](Regex%20Tester/README.md) |
| **Pomodoro Timer** | Focus/break cycles with recovery and daily progress. | [Open](Pomodoro%20Timer/index.html) | [README](Pomodoro%20Timer/README.md) |
| **Unit Converter** | Convert ten categories with clear definitions and configurable precision. | [Open](Unit%20Converter/index.html) | [README](Unit%20Converter/README.md) |
| **Lorem Ipsum Generator** | Generate paragraphs, sentences, words and lists with optional repeatable seeds. | [Open](Lorem%20Ipsum%20Generator/index.html) | [README](Lorem%20Ipsum%20Generator/README.md) |

## Getting Started

1. [Download the repository ZIP](https://github.com/KhemnarMayuresh/Tools/archive/refs/heads/main.zip) or clone it:

   ```sh
   git clone https://github.com/KhemnarMayuresh/Tools.git
   ```

2. Keep each tool’s HTML, JavaScript, CSS and assets together.
3. Open the entry page using the directory above. No build step, account or API key is needed to use these tools.

For larger Text Compare or Splitter inputs, serve the repository over HTTP so browsers can use workers. If Python is installed, run from the repository root:

```sh
python -m http.server 8000
```

Open [the local directory](http://localhost:8000/) and choose a tool. Stop the server with Ctrl+C. A modern browser with JavaScript enabled is required. Audio, clipboard and storage permissions vary by browser; see each guide for fallbacks and limits.

## Shared Improvements

- Top-right sun, moon and monitor icons select **Light**, **Dark** or **System** theme, with a locally saved preference when storage is available.
- Responsive layouts, labelled controls, visible keyboard focus and clear status messages. Games provide reduced-motion support.
- Games start with collapsed settings and place the main play area before scores and history.
- Local processing and bundled runtime assets; downloaded tools work offline, subject to the browser requirements in their guides.
- Individual READMEs explain how to use/play, demo URLs, features, requirements, installation, saved data and developer verification.

## Tools and Current Features

### Text Compare

Compare two versions of text or code and export the changes.

**Quick start:** Paste or open files in **Original** and **Modified**, click **Compare**, then choose Split or Unified view.

**Features:** Myers line comparison; line numbers and inline changes; local syntax highlighting; expandable unchanged ranges; previous/next change navigation; whitespace-ignore display; copy/download exact unified patches; cancellable processing.

[Full guide](Text-Compare/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Text-Compare/index.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Text-Compare/index.html)

### ChatGPT Splitter

Turn long text into editable messages with a sequential copying workflow.

**Quick start:** Paste your text, choose a complete-message character budget, and select **Generate parts**. Copy the initial instructions, then each part in order.

**Features:** Paragraph/sentence/word boundaries; Unicode-safe splitting for Hindi and joined emoji; wrapper-aware budgets; editable parts and custom instructions; saved numeric profile preferences; copied badges; manual clipboard fallback; stale-output and size-limit feedback. Profile budgets and token estimates are not verified model limits.

[Full guide](ChatGPT%20Splitter/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/ChatGPT%20Splitter/index.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/ChatGPT%20Splitter/index.html)

### 30 Second Drawing Game

Draw the same prompt on paper, race the timer, and choose a winner together.

**Quick start:** Give everyone paper and pencils. Open **Game settings** to enter players, then click **Start round**. After time expires, award a point or choose **No winner**. Continue or select **Finish game**.

**Features:** Collapsed settings; Ready/Set/Go countdown; 10–120-second timer; 1–12 players; 279 built-in prompts, including 150 editable Everyday Things words familiar to Indian households; add/remove/rename words and custom categories; character reference images; unused-prompt selection; scoreboard and round history; animated top-three podium and remaining rankings. Drawing and judging happen outside the webpage.

[Full guide](30%20Second%20Drawing%20Game/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/30%20Second%20Drawing%20Game/30sDrawingGame.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/30%20Second%20Drawing%20Game/30sDrawingGame.html)

### Infinite Tic Tac Toe

Play a strategic Tic Tac Toe variant where your oldest marks leave the board.

**Quick start:** Choose **Start match**, then take turns selecting empty squares. Connect the required marks to win; check the **next** indicator to see which mark will disappear.

**Features:** 3 × 3 through 10 × 10 boards; configurable winning length; two players or Computer O with six difficulty levels; ordered mark queues; pause/resume, undo and round restart; alternating starters; scoreboard/history; repetition and move-limit draws; optional local sound. Each player retains as many marks as the grid size.

[Full guide](Infinite%20Tic%20Tac%20Toe/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Infinite%20Tic%20Tac%20Toe/index.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Infinite%20Tic%20Tac%20Toe/index.html)

### Passing the Parcel Game

Host a physical party game or a labelled on-screen parcel simulation.

**Quick start:** Enter players in **Game settings**, choose Forfeit or Elimination, and select **Start round**. When music stops, select the holder and **Confirm result**, then continue.

**Features:** 2–20 players; two built-in local instrumental loops or optional audio upload; configurable random stop range; random or chosen simulation starter; adjustable passing interval; volume; pause/resume, manual stop and cancellation; optional forfeits; confirmed catches and history; elimination winner card with confetti and standings ordered from the last elimination to the first. Physical mode requires the host to identify the actual holder.

[Full guide](Passing%20the%20Parcel%20Game/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Passing%20the%20Parcel%20Game/PassingTheParcel.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Passing%20the%20Parcel%20Game/PassingTheParcel.html)

### गीतकारिका Text Editor — Lyricist Studio

Write and organize verses, notes and ideas in a local section-based studio.

**Quick start:** Choose **Add Section / Verse**, name the section, and use its **Add text line** or + button. Write, select text to format it, and export a JSON backup regularly.

**Features:** Full-width header and formatting toolbar; collapsible left sidebar with Structure, Display Settings and Files & Export Backups; responsive layout presets; hover/focus drag grips, order arrows and icon menus (always visible on touch); section/block resizing and moving; bold/italic/underline, sizes and alignment; autosave and recovery; Undo/Redo; Unicode counts with separate section/text toggles; compact Find at the toolbar’s right edge, occurrence navigation and optional Replace/Replace all; JSON/TXT import/export and print/PDF. Layout lock and focus mode have been removed.

[Full guide](%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html)

### JSON Formatter & Viewer

Paste or open UTF-8 JSON, then choose **Format** or **Minify**. Switch to Tree to explore nodes, search keys/values and copy JSON Pointer paths or node values. Supports indentation settings, duplicate-key warnings, literal-preserving large numbers, standard JSON downloads and cancellable worker processing.

[Full guide](JSON%20Formatter%20%26%20Viewer/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/JSON%20Formatter%20%26%20Viewer/index.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/JSON%20Formatter%20%26%20Viewer/index.html)

### Regex Tester

Enter a pattern and flags, paste test text, then Run. Includes highlighted matches, capture groups, UTF-16 positions, navigation, replacement previews, syntax examples, shared SVG theme icons and clipboard fallback. Worker-only execution has a two-second timeout and Cancel control.

[Full guide](Regex%20Tester/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Regex%20Tester/index.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Regex%20Tester/index.html)

### Pomodoro Timer

Start a 25-minute focus session, then follow short and long breaks. Includes configurable durations, pause/reset/skip, optional task and local alerts, daily progress/history, saved deadline recovery and Web Locks coordination across tabs. Uses the shared SVG icons and theme controls.

[Full guide](Pomodoro%20Timer/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Pomodoro%20Timer/index.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Pomodoro%20Timer/index.html)

### Unit Converter

Choose a category, enter a value and select From/To units. Includes live conversion, swap/copy, all-units table, decimal-place/significant-figure settings, temperature boundaries, distinct US/Imperial volume and decimal/binary storage units. Uses shared SVG icons and theme controls.

[Full guide](Unit%20Converter/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Unit%20Converter/index.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Unit%20Converter/index.html)

### Lorem Ipsum Generator

Choose an output type and quantity, then Generate. Includes exact word counts, paragraph lengths, opening phrase, optional repeatable seed, plain-text/HTML source, counts, copy/download and shared SVG theme controls.

[Full guide](Lorem%20Ipsum%20Generator/README.md) · [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Lorem%20Ipsum%20Generator/index.html) · [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Lorem%20Ipsum%20Generator/index.html)

## Demo Versions

The third-party preview links use the published **main** branch. Local changes appear there only after they are published. Preview availability has not been verified for this documentation update; downloaded files provide the current local version. Historical editor demos remain linked in the editor’s guide.

## Privacy and Saved Data

| Tool | What is retained |
| --- | --- |
| Lorem Ipsum Generator | Theme and generation preferences; output and seed are session-only. |
| Unit Converter | Theme, category, unit selections and precision; input values are session-only. |
| Pomodoro Timer | Timer state, optional task, settings, preferences and up to 500 history entries. |
| Regex Tester | Theme and automatic-run preference; patterns, text and results are session-only. |
| JSON Formatter & Viewer | Theme and indentation preferences; JSON content is never automatically saved. |
| Text Compare | Theme preference; comparison text is not automatically saved. |
| ChatGPT Splitter | Theme and numeric profile budgets; source, instructions, edited parts and copy progress are not saved. |
| Drawing Game | Theme/sound preferences and the saved Everyday Things list; players, scores, history, selections and other custom categories clear on refresh. |
| Infinite Tic Tac Toe | Theme and sound/volume preferences; boards, names, scores and round history clear on refresh. |
| Passing the Parcel | Theme and volume; player names, music and results are session-only. |
| Lyricist Studio | Document autosave plus UI preferences; Undo history is session-only. Export JSON backups to keep writing outside browser storage. |

Tool content is processed locally. Browser saves belong to the page’s origin; local files, local servers and online previews may have separate storage. Clearing browser storage can remove saved work and preferences. Sending copied Splitter messages to an external service is a separate user action.

## Development and Contributions

Node.js is used for developer tests, and browser checks generally use Playwright with Edge. These are not required for ordinary use. Follow the commands and requirements in the relevant tool’s README; keep changes and verification scoped to the affected tool.

[Report an issue](https://github.com/KhemnarMayuresh/Tools/issues) with the tool name, browser/device and reproduction steps, or [submit a pull request](https://github.com/KhemnarMayuresh/Tools/pulls). Avoid including private text, documents or player details.

## License and Author

[MIT License](LICENSE) · [Mayuresh Sunil Khemnar](https://github.com/KhemnarMayuresh)
