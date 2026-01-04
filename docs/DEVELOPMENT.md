# Development Guide

## Prerequisites

- Node.js (LTS)
- `pnpm` installed globally

## Install

```bash
pnpm install
```

## Build and Run

```bash
pnpm run build
```

- For continuous rebuilds while developing:

```bash
pnpm run dev
```

- Load the extension in Chrome via `chrome://extensions`.
- Enable Developer Mode and load the unpacked folder from `dist/` after a build.

## Test

```bash
pnpm run test
```

## Manual QA Plan

- Verify badge updates when tabs are opened and closed (single window and multiple windows).
- Confirm tab updates (URL change, reload) do not break badge updates or storage writes.
- Validate popup displays current count and daily/weekly/monthly totals after tab activity.
- Toggle settings in Options and confirm badge thresholds and message toggles take effect.
- Retention rollover: in the service worker console, write a `countsByHour` entry older than 90 days, trigger a tab change, and confirm the old entry is removed and totals are recomputed.

## Release Checklist

- Run `pnpm run lint` and `pnpm run test`.
- Run `pnpm run build` and confirm `dist/` contains `background.js`, `popup.html`, `options.html`, and assets.
- Validate the extension loads from `dist/` in `chrome://extensions`.
- Perform Manual QA Plan steps.
- Confirm privacy policy and retention statement are current (`docs/PRIVACY.md`).
- Review `public/manifest.json` for correct version, permissions, and descriptions.
- Run `pnpm run release` to generate `dist.zip` for submission.
- Create and push a `vX.Y.Z` tag to trigger the GitHub Actions release workflow.

## GitHub Release Automation

- The workflow at `.github/workflows/release.yml` runs on version tags (`v*`).
- It runs lint and tests, builds the extension, creates `dist.zip`, and publishes a GitHub Release.

## Lint and Format

```bash
pnpm run lint
pnpm run format
```

## Notes

- The service worker lives under `src/background/`.
- Only add content scripts if a page-level signal is required.
