# गीतकारिका Text Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Reliable, safe section-based writing with backups and an accessible themed interface.
**Architecture:** Pure document/history module, DOM sanitizer and file projection module, owned storage adapter, vanilla UI controller. Existing HTML entry stays compatible; no remote dependencies.
**Tech Stack:** Classic JavaScript/UMD, contenteditable/Range, DOMParser, localStorage, Node test runner, Playwright/Edge.
**Spec:** ../specs/2026-10-10-geetkarika-editor.md

## Global constraints
Use spec schema, limits, storage keys, history bounds and safe HTML allowlist verbatim. Preserve legacy saves and user files. Work in current feature checkout; leave changes uncommitted. No DOCX/IndexedDB/tags. No remote assets. Tests before behavior changes.

## Review focus
1. Imported/legacy nested controls or hostile markup cannot execute or enter output — Task2 browser fixtures.
2. Hindi IME and toolbar focus must preserve text/selection — Task4 composition/range checks.
3. Corrupt/quota/denied storage cannot falsely say Saved or destroy recovery — Task3 tests and Task5 browser recovery.
4. Moving into empty/collapsed sections must preserve IDs and exactly one block — Task1 pure and Task5 drop tests.
5. Undo after import/delete and pagehide/save races must retain current document — Tasks1/3/5 checks.

## Task1: document and history
Files editor-core.js, tests/editor-core.test.cjs. Interfaces emptyDocument(), validateDocument(value), apply(doc,action), createHistory(initial) with current/commit/undo/redo/canUndo/canRedo, counts(text).
- [x] Write failing schema/limits, immutable add/update/delete/move, empty target, duplicate ID and grouped undo/import/redo tests.
- [x] Run node --test "गीतकारिका Text Editor/tests/editor-core.test.cjs"; observe RED.
- [x] Implement exact schema/actions/history bounds and Unicode counts.
- [x] Rerun; expect GREEN and unchanged input snapshots.

## Task2: content, legacy migration and files
Files content.js, tests/browser-editor.cjs. Interfaces sanitize(html)->canonicalHTML, plainText(html)->string, fromText(text)->HTML, migrateLegacy(array)->document, normalizeDocument(doc)->safe document, exportText(doc)->string. Browser global EditorContent.
- [x] Add failing browser fixtures for embedded buttons, scripts/handlers/media, Hindi/newline text, safe formatting and duplicate legacy IDs.
- [x] Implement inert rebuild sanitizer and schema-compatible migration; IDs generated locally; exports omit controls and preserve section order.
- [x] Run fixture checks; expect no executions, exactly one control/block and safe roundtrip.

## Task3: autosave adapter
Files storage.js, tests/storage.test.cjs. Interfaces createStorage({storage,schedule,cancel,onStatus}) load()->{kind,value,raw,error}, save(doc), flush(), dispose(); keys new/legacy above; failed/unreadable load protects writes until allowOverwrite().
- [x] Write RED for missing/legacy/corrupt data, latest debounced write, quota/denied storage, flush and stale callbacks.
- [x] Implement non-destructive load and guarded writes400ms; status saving/saved/error and explicit allowOverwrite.
- [x] Run unit suite; expect failed writes retain caller document and never announce saved.

## Task4: editing UI, themes and document operations
Files existing HTML, styles.css, app.js, tests/browser-editor.cjs. Consume Tasks1–3 globals; no application-specific helpers in core.
- [x] Write RED browser flows for selected Add text, title/block input, safe paste/composition, range formatting/alignment and undo/redo, section/block keyboard moves, themes, counts/search/focus, confirmations, imports/export/print.
- [x] Implement responsive toolbar/workspace, dedicated handle drag/drop with empty targets, explicit sizes/native resize, selection/caret ownership, history grouping, inline focus-trapped confirmations, backups/import atomicity and save status.
- [x] Run browser flows; expect no content controls serialized, correct selection targets, truthful storage status and no remote requests.

## Task5: resilience, documentation and verification
Files README.md, tests/browser-storage.cjs, all editor files.
- [x] Add RED cases for legacy/corrupt/denied/quota storage, reload/pagehide, external changes, import cancellation/limits, collapsed print, 375px/landscape/reduced motion and keyboard access.
- [x] Fix only demonstrated failures; verify output screenshots and browser errors/network.
- [x] Rewrite README with quick start/how to use/demo/features/requirements/install/backups/shortcuts/code structure/checks/license/contributions. Preserve links, label pinned demos historical and unverified.
- [x] Run editor and existing Node suites, browser flows, JS syntax and git diff --check.
- [x] One final independent review; fix Important/Critical with RED→GREEN and rerun affected suite; record minor findings and final evidence in ledger. No commit/push/deploy.
