# Pomodoro Timer

A local focus-and-break timer with saved recovery, daily progress and optional alerts. No account, remote scripts or build step is required.

## How to Use

1. Open **index.html** and optionally enter a task label.
2. Select **Start** for a 25-minute focus session. **Pause** preserves remaining time; Start resumes it.
3. When focus finishes, a five-minute short break is ready. After four completed focus sessions, the next break is 15 minutes.
4. Select Start to continue. Sessions do not start automatically by default. Enable automatic breaks and/or focus sessions in **Timer settings** if desired.
5. Reset or Skip asks for confirmation. Reset discards unfinished progress; skipped focus sessions never count as completed. A skipped focus session leads to a short break; skipping a break returns to focus.
6. Review today’s completed focus sessions and minutes, plus session history. Clear History removes records, retaining the current timer and cycle count.

## Features

- Timestamp-based countdown, pause/resume, reset and skip.
- Focus/short-break/long-break cycle with configurable durations and frequency.
- Circular progress, remaining time in tab title and next-session label.
- Optional task, locally saved state/preferences and up to 500 history entries.
- Today’s completed focus sessions and scheduled focus minutes.
- Locally generated completion sound, volume/test controls and opt-in browser notifications.
- Shared SVG controls and top-right Light/Dark/System themes.
- Responsive layout, confirmations, keyboard focus and reduced-motion support.
- One active timer per browser origin, coordinated through Web Locks.

## Settings and Timing

Defaults are **25/5/15 minutes**, with a long break every **four completed focus sessions**. Durations accept whole minutes from **1–180** and cycle length from **1–12**. Apply immediately updates an idle timer. A running or partially elapsed paused timer keeps its remaining time; Reset applies new durations now, otherwise they apply next session.

The countdown uses a saved deadline rather than accumulating interval ticks. Backgrounded pages reconcile against that deadline when they run again. System-clock changes can affect the deadline. Browser suspension may delay sound or notifications; this is not an alarm-clock service.

An overdue session completes once. If completion is observed more than five seconds late, automatic continuation is suppressed and Start is required. No missed focus sessions or breaks are fabricated. Reload recovery follows the same rule. Short delays may still trigger enabled automatic transitions.

Completed focus minutes use the configured duration of the finished session, excluding resets, skips and breaks. Today uses the browser’s local calendar date. Cycle count continues across days and history clearing.

## Requirements and Installation

Keep this folder’s files together and open **index.html** in a modern browser with JavaScript and **Web Locks**. Web Locks are required to start or recover a running timer safely across tabs. Browsers/origins lacking this capability show guidance rather than starting an uncoordinated timer.

For a local server, run from the repository root with Python installed:

```sh
python -m http.server 8000
```

Open [the local timer](http://localhost:8000/Pomodoro%20Timer/index.html). Stop the server with Ctrl+C. Downloaded files work offline. Node.js is required only for developer tests.

## Live Demo

- [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Pomodoro%20Timer/index.html)
- [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Pomodoro%20Timer/index.html)

These target the published main branch; local changes require publication. Preview availability is unverified.

## Alerts

Sound is synthesized locally using Web Audio. Start or Test sound provides the user interaction browsers generally require. Blocked audio does not stop the visual countdown.

Choose **Enable notifications** to request permission explicitly. Denied or unsupported notifications leave visible alerts available. Notification behavior depends on browser and OS settings. No remote push service runs after closing the page.

## Privacy, Recovery and Multiple Tabs

The `pomodoro-v1` localStorage entry contains timer state, settings, optional task, preferences and bounded history. Nothing is uploaded. Saves belong to the origin: file pages, localhost ports and demo hosts may have separate state. Clearing browser data removes saved progress.

An open active tab holds a Web Lock; other tabs display the countdown and disable conflicting timer controls. Pause or closing the tab releases the lock. Reload recovers the saved deadline if no other tab owns it. Coordination is per origin/browser profile; separate origins/profiles remain independent.

Unavailable or unreadable storage produces a visible notice and permits session-only use where Web Locks work. Invalid saved data is not automatically overwritten. Without functioning storage, separate tabs cannot share state, though the lock still prevents simultaneous active timers on the origin. There is no export or cross-device synchronization in this version.

## Code and Developer Checks

| File | Purpose |
| --- | --- |
| core.js | Pure deadline, pause/reset/skip and cycle transitions. |
| app.js | Persistence validation, Web Locks, lifecycle, history, alerts and UI. |
| icons.js | Local shared SVG icons. |
| index.html / styles.css | Responsive timer, settings and confirmations. |
| tests/ | State transitions and actual-browser recovery/coordination checks. |

```sh
node --test "Pomodoro Timer/tests/core.test.cjs"
```

Browser checks require Playwright and installed Edge. Set `PLAYWRIGHT_PATH` to the module directory if installed outside the repository:

```sh
node "Pomodoro Timer/tests/browser.cjs"
```

## License and Contributions

[MIT](../LICENSE). [Report issues](https://github.com/KhemnarMayuresh/Tools/issues) with browser, origin and reproduction steps. Author: [Mayuresh Sunil Khemnar](https://github.com/KhemnarMayuresh).
