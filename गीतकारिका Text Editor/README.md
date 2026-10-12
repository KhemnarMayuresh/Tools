# गीतकारिका Text Editor

A private section-based editor for verses, notes and ideas. Write in Hindi or any language, organize text blocks, format selected text, and keep downloadable backups. It runs locally without an account or remote services.

**Quick start:** open `गीतकारिका Text Editor .html`, choose **Add Section / Verse**, then the section’s **Add text line** button. Click inside the text block and start writing. Open **Files & backup → Export JSON backup** to keep a copy outside your browser.

## How to Use

1. **Create a section.** Give it a title, such as a verse, chapter or topic. The ☰ Studio controls button collapses or expands the left sidebar. Structure contains layout presets and the section list; Display Settings and Files & Export Backups are separate collapsible groups. Add Section / Verse is in the canvas action bar; each section has its own Add text line button.
2. **Add text to the right section.** Use the section’s Add text line button or the + icon in its header.
3. **Write and format.** Select text, then choose bold, italic, underline or a font size. Alignment applies to the active text block. Formatting wraps selected text; click inside a block before choosing alignment. Pasted content uses plain text and preserves line breaks.
4. **Rearrange your work.** Hover over a text block to reveal its top-left drag grip and top-right order arrows and ⋯ menu. Keyboard focus also reveals these controls; touch screens keep them visible. Drag a grip to place a block before another block or move it into another section. Use arrows for repeated reordering, and ⋯ for Move to section, resize and delete. Section headers always show their controls. There is no layout lock or focus mode.
5. **Find text.** Click **Find** on the right of the formatting toolbar to open search. The opened panel stays visible while scrolling; Close (×) or Escape hides it and returns focus to Find. Your search term is retained until reload. Search titles and text with ↑/↓ or Enter/Shift+Enter. The current occurrence is selected. Click **⋯** to reveal **Replace with**, **Replace**, and **Replace all**. Replace changes the current match (or the first if none is selected); Replace all updates all matches in one Undo step. Search is literal and case-insensitive. Empty replacement deletes matched text. Replacement text is inserted literally, preserving formatting outside the matches. Title/document limits are checked before any replacement is saved; Replace all supports up to 10,000 matches per operation.
6. **Undo a mistake.** Use Undo/Redo for text changes, formatting, moves, imports and deletion. Typing on the same target within one second groups into a step. History is session-only and bounded to 50 steps and 8 MiB; it does not survive reload.
7. **Keep a backup.** Browser autosave is convenient, but browser storage can be cleared. Export a JSON backup regularly and before replacing or deleting important writing.

Section titles and text are displayed literally and safely. Hindi composition is preserved during typing and checkpointed when you leave the page. If a file finishes loading while you are composing text, its import is cancelled with a message; finish typing and import again. Words and characters are counted for text blocks and sections, with totals at the top; block counts appear in the text toolbar; titles are excluded. Words use the browser's Unicode segmenter when available (otherwise whitespace groups). Characters are Unicode code points, including whitespace; a joined emoji may contain multiple code points.

## Studio Layout

The header and formatting toolbar form separate full-width bands. The unified sidebar has icon-labelled accordion rows. Choose a layout preset for a stack, two to four columns, or a repeating two-split/one-full arrangement. Presets change presentation only and are saved separately from the document. Narrow screens reduce columns to keep writing readable. Use inline Add text line and Append New Verse / Section for quick additions.

## Display Settings

Open **Settings** in the left sidebar before Files & backup. Toggle section text-block, word and character counts, and text-block word and character counts independently. All five start enabled and are remembered in this browser when storage is available. Section summaries follow your count preferences; text toolbars reveal their action controls on hover or keyboard focus. Document totals remain visible regardless of these settings. Settings are separate from JSON document backups.

## Live Demo

- [Current HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html)
- [Main-branch GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html)
- [Historical version 2](https://rawcdn.githack.com/KhemnarMayuresh/Tools/d63d03564fb59a87508e3c5a153a23b9316b66d7/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html)
- [Historical version 1](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/64e57f6094d13a0059acef2f4b16012931fdf5e9/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html) · [GitHack](https://rawcdn.githack.com/KhemnarMayuresh/Tools/64e57f6094d13a0059acef2f4b16012931fdf5e9/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html)

These preview URLs are preserved for reference. Availability and deployment of the current changes have not been verified. Use the downloaded files for this version. Browser storage belongs to the page's origin; files, different servers and demo hosts do not share saves. Move work between them using JSON backups.

## Features

- Reference-inspired writing studio with plum dark surfaces, purple accents, compact formatting toolbar and unified sidebar; Light, Dark and System themes remain available.
- Named sections and editable text blocks with a clear selected section.
- Text-block drag and reorder controls appear on hover or keyboard focus and stay visible on touch screens.
- Bold, italic, underline, four text sizes and block alignment.
- Section collapse and adjustable sizes.
- Autosave with visible **Saving / Saved / Unable to save** status.
- Safe migration of old `sections` saves, retaining the original data.
- Document-level Undo/Redo, search, Unicode word/character counts.
- JSON backup/import, plain-text import/export, and print / Save as PDF.
- Top-right Light, Dark and System theme icons.
- Responsive controls, keyboard focus and reduced-motion support.
- No remote fonts, tracking, network data transfer or runtime dependencies.

## Requirements

A modern browser with JavaScript, contenteditable, DOMParser, Selection/Range and file downloads. Local storage is optional: if it is denied or full, your current edits remain open and JSON export still works. Theme changes work for the session when preferences cannot be stored.

No backend, Node.js or installation is needed for writing. OS/browser Hindi input works normally; the editor does not provide its own transliteration keyboard.

## Installation

Download or clone [this repository](https://github.com/KhemnarMayuresh/Tools), keeping all files inside `गीतकारिका Text Editor` together. Open **`गीतकारिका Text Editor .html`** (its filename contains a space before `.html`).

For a local HTTP server, run this from the repository root if Python is installed:

```sh
python -m http.server 8000
```

Open [the local editor](http://localhost:8000/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html). Stop the server with Ctrl+C. No internet is needed after download.

## Backup, Import and Export

| Action | What it does |
| --- | --- |
| Export JSON backup | Downloads the versioned document, including safe formatting, IDs, order, collapsed state and sizes. Theme and undo history are not included. |
| Import JSON | Validates and sanitizes the whole backup before asking to replace the current document. Cancel keeps your work. Undo can restore the previous document during this session. |
| Import TXT | Adds a plain-text block to the selected section; creates a section if none exists. Preserves line breaks and treats markup literally. |
| Export section as TXT (section ⋯ menu) | Downloads only that section’s title and text blocks in document order, including when collapsed. Uses the section title as the filename; formatting is omitted. |
| Export TXT | Downloads section titles and plain text in document order, omitting editor controls. Formatting and layout are not included. |
| Print / Save as PDF | Opens the browser print dialog. All sections print, even when collapsed. Choose Save as PDF in that dialog. |
| Download recovery data | Keeps an untouched copy of unreadable saved data before an explicit Start fresh or JSON replacement. |

File imports are limited to **4 MiB**. Documents support **100 sections**, **500 text blocks**, titles up to **200 Unicode code points**, **200,000 HTML code units per text block**, and **2,000,000 total HTML code units**. Escaped text and formatting contribute to HTML limits. Invalid/oversized imports leave the current document unchanged.

Only supported text formatting is kept from JSON/legacy HTML. Scripts, control buttons, embedded media, URLs and event handlers are removed. External HTML drops are blocked; use plain-text paste or Import instead.

## Autosave and Recovery

Edits save after a **400 ms debounce**, with an immediate checkpoint when the page is hidden or left. Save status reports actual success; failed writes do not clear your in-memory document. Download a JSON backup before closing a page that says Unable to save.

New saves use `geetkarika-document-v1`. The older `sections` key is loaded only when no new document exists and is never modified or deleted by migration. The old editor stored its own delete controls inside text; migration removes those controls and restores text into separate editable areas. The old format did not record resized dimensions or collapsed state, so those cannot be recovered from old saves. New saves retain them.

Unreadable/invalid saved data is protected from automatic overwrite. Download recovery data, then explicitly choose Start fresh or confirm a valid JSON replacement. Another tab changing the save produces a warning; your open edits are kept rather than replaced automatically.

## Controls and Shortcuts

- **Ctrl/Cmd+Z:** Undo inside the writing workspace; **Ctrl/Cmd+Shift+Z** or **Ctrl/Cmd+Y:** Redo. Undo/Redo buttons also cover structural changes.
- **Ctrl/Cmd+B / I / U:** Apply bold/italic/underline to selected block text.
- **Enter / Shift+Enter in Find:** Next/previous search match.
- **Escape:** Close an open Find panel or ⋯ menu, or cancel a confirmation.
- **Tab / Shift+Tab:** Navigate labelled controls; confirmations retain focus until dismissed.
- **Resize section / Text block size (inside ⋯):** Enter dimensions or leave blank for Auto. Widths range from 240–1600 px for sections and 140–1600 px for text; section heights range from 120–1600 px. Desktop resize handles also capture changes. Mobile presentation clamps widths without overwriting stored values.

## Code Structure

| File | Responsibility |
| --- | --- |
| `गीतकारिका Text Editor .html` | Entry page, controls and accessible confirmation dialog. |
| `styles.css` | Themes, responsive workspace, hover controls and print layout. |
| `editor-core.js` | Validated document model, immutable actions, grouped history and counts. |
| `content.js` | Safe HTML, legacy migration and plain-text projections. |
| `storage.js` | Protected load, debounced autosave, flush and failure status. |
| `icons.js` | Local SVG icons for static and dynamic controls. |
| `app.js` | Editing, selection, formatting, moves, files, themes and browser lifecycle. |
| `tests/` | Pure-module and actual-browser checks. |

## Developer Checks

Node.js is required only for tests. From the repository root:

```sh
node --test "गीतकारिका Text Editor/tests/*.test.cjs"
```

Browser checks require Playwright and installed Edge. Set `PLAYWRIGHT_PATH` to the module folder if it is outside the repository:

```sh
node "गीतकारिका Text Editor/tests/browser-editor.cjs"
node "गीतकारिका Text Editor/tests/browser-storage.cjs"
node "गीतकारिका Text Editor/tests/browser-operations.cjs"
node "गीतकारिका Text Editor/tests/browser-review.cjs"
```

Checks exercise file and HTTP use, legacy/hostile content, Hindi composition events, actual dragging, backups, storage failures, Back navigation, printing, themes and responsive layouts. Simulated composition checks do not substitute for testing every OS keyboard. Mobile/landscape screenshots are written to the system temporary directory under `geetkarika-editor`.

## License

Available under the repository's [MIT License](../LICENSE).

## Issues & Contributions

Report bugs or suggest improvements through [GitHub issues](https://github.com/KhemnarMayuresh/Tools/issues). Include browser, whether you opened a file or HTTP URL, save status, and steps to reproduce. Avoid posting private document contents. DOCX export, IndexedDB and tags remain future improvements.

**Author:** [Mayuresh Sunil Khemnar](https://github.com/KhemnarMayuresh).
