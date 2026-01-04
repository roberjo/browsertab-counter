# Browser Tab Counter

## Overview

Browser Tab Counter is a Chrome extension that tracks how many tabs are open at a given time, aggregates counts by hour/day/week/month, and shows lighthearted messages and badge thresholds. It is designed to keep data on-device and remain lightweight.

## Features

- Real-time tab count badge with configurable thresholds.
- Aggregated stats for daily, weekly, and monthly totals.
- Funny messages triggered at tab count milestones.
- Options page to control thresholds and messaging.

## Data Retention

- Tab count data is retained on a rolling 90-day window.
- Older data is automatically pruned during normal usage.

## Privacy

- All data is stored locally using Chrome `chrome.storage.local`.
- No browsing history, URLs, or page content are collected.
- See `docs/PRIVACY.md` for the full policy.

## Project Structure

- `src/background/` background service worker logic
- `src/analytics/` aggregation and pruning logic
- `src/storage/` storage schema and migrations
- `src/ui/popup/` popup UI
- `src/ui/options/` options UI
- `public/` manifest and static assets

## Development

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
```

## Test

```bash
pnpm run test
```

## Release

```bash
pnpm run release
```

- `pnpm run release` builds the extension and creates `dist.zip`.
- Pushing a `vX.Y.Z` tag triggers the GitHub Actions release workflow in `.github/workflows/release.yml`.

## Load in Chrome

- Open `chrome://extensions`.
- Enable Developer Mode.
- Click "Load unpacked" and select the `dist/` folder after a build.

## Documentation

- `docs/ARCHITECTURE.md` architecture overview and module responsibilities
- `docs/DEVELOPMENT.md` local workflow and QA plan
- `docs/PRIVACY.md` privacy and data handling
- `docs/TASKLIST.md` project roadmap

## Support

- Open an issue with steps to reproduce and expected behavior.

## Security

- This extension follows least-privilege permissions (`tabs`, `storage`).
- For security concerns, open a private issue or contact the maintainer.

## License

- License not yet specified.
