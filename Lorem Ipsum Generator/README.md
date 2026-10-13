# Lorem Ipsum Generator

Generate placeholder text locally for mockups, documents and layouts. No account, API, external vocabulary or network service is required.

## How to Use

1. Open **index.html**. Choose Paragraphs, Sentences, Words or List items and enter a quantity.
2. Expand **Generation settings** for the opening phrase, paragraph length, plain-text/HTML format and optional seed.
3. Select **Generate** or press Ctrl/Cmd+Enter. With no seed, Generate produces a fresh random sequence. A supplied seed repeats the same output for identical settings.
4. Copy or download output. Clipboard denial reveals selected text for manual copying. HTML is displayed as source, never executed in the page.
5. Clear empties output while retaining settings. Changing settings clears outdated output and disables copying/downloading until generation succeeds again.

## Features

- Exact quantities: paragraphs, sentences, words or list items.
- Bundled randomized Lorem Ipsum vocabulary and optional repeatable seed.
- Start with Lorem ipsum enabled by default; short/medium/long paragraphs.
- Plain text or safe HTML paragraph/list fragments.
- Word and Unicode character counts, copy fallback and UTF-8 downloads.
- Shared SVG controls and top-right Light/Dark/System themes.
- Responsive layout, keyboard shortcut and visible status messages.

## Generation Rules and Limits

| Output type | Quantity limit | Structure |
| --- | --- | --- |
| Paragraphs | 1–100 | Short = 2, medium = 4, long = 7 sentences each. |
| Sentences | 1–500 | One generated sentence per requested item. |
| Words | 1–10,000 | Exact number of space-separated words. |
| List items | 1–500 | One sentence per item; numbered plain text or HTML unordered list. |

Sentences contain 8–18 vocabulary words with capitalization and a final period. When enabled, the first item begins **Lorem ipsum dolor sit amet consectetur adipiscing elit**. Word mode truncates this opening to the requested word count, so requesting two words gives **Lorem ipsum**. The text is randomized pseudo-Latin placeholder content, not a translation or grammatical Latin.

The seed accepts up to 200 characters and is session-only. Repeatability applies to this generator version and identical settings. With an empty seed, local cryptographic randomness supplies a seed when available, with a local random fallback. Random generations may repeat by chance.

HTML format uses `<p>` elements, or `<ul>`/`<li>` for lists; words and sentences use one paragraph. Downloads are UTF-8 `.txt` or `.html` fragments with matching MIME types. Plain-text paragraphs retain blank lines.

Word counts exclude HTML tags and list numbering. Character counts use Unicode code points in the plain-text representation, including spaces, line breaks and plain-text list numbering; HTML tags are excluded. Invalid or excessive quantities show an error, never silent truncation.

## Requirements and Installation

Use a modern browser with JavaScript enabled. Keep all files together and open **index.html**. No Node.js, package installation or build step is required. Downloaded files work offline.

Optional HTTP serving, from the repository root with Python installed:

```sh
python -m http.server 8000
```

Open [the local generator](http://localhost:8000/Lorem%20Ipsum%20Generator/index.html). Stop the server with Ctrl+C.

## Live Demo

- [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Lorem%20Ipsum%20Generator/index.html)
- [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Lorem%20Ipsum%20Generator/index.html)

Links target published main; local changes require publication. Availability is unverified.

## Privacy and Preferences

Theme and generation preferences are retained in `lorem-prefs` after successful generation or theme selection when storage is available. Generated output and the optional seed are not saved. Denied storage leaves generation usable. No external scripts, fonts, tracking or content uploads are used. Browser and antivirus checks may still block a requested download; the generator does not bypass them.

## Code and Developer Checks

| File | Purpose |
| --- | --- |
| core.js | Seeded vocabulary generation, quantity limits, counts and HTML serialization. |
| app.js | Settings, stale output, clipboard, downloads and preferences. |
| icons.js | Shared local SVG icons. |
| index.html / styles.css | Responsive interface and themes. |
| tests/ | Exact quantities, repeatability, limits and actual-browser downloads. |

Node.js is required only for developer tests:

```sh
node --test "Lorem Ipsum Generator/tests/core.test.cjs"
```

Browser checks require Playwright and installed Edge. Set `PLAYWRIGHT_PATH` to the package directory if outside the repository:

```sh
node "Lorem Ipsum Generator/tests/browser.cjs"
```

## License and Contributions

[MIT](../LICENSE). [Report issues](https://github.com/KhemnarMayuresh/Tools/issues) with settings, seed and browser. Author: [Mayuresh Sunil Khemnar](https://github.com/KhemnarMayuresh).
