# JSON Formatter & Viewer implementation

Approved scope: local formatting/validation, number-preserving output, duplicate-key warnings, text/tree views, search, JSON Pointer copying, themes, file inputs and exports. No automatic content persistence.

1. Implement and test a bounded recursive-descent parser producing typed nodes, preserving numeric literals and object entries. Verify errors, Unicode, duplicate keys, JSON Pointer escaping and round trips.
2. Build responsive HTML/CSS and application controller. Use worker processing with direct-file fallback, cancellation, stale-state handling, bounded tree rows, safe text rendering and clipboard fallback.
3. Verify browser workflows and actual JSON downloads. Document installation, privacy, limits and developer checks; update root directory.

Files: core.js (parser/format/path), worker.js (background processing), app.js (UI), index.html/styles.css (presentation), tests/core.test.cjs and browser.cjs, README.md.
