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

## Lint and Format

```bash
pnpm run lint
pnpm run format
```

## Notes

- The service worker lives under `src/background/`.
- Only add content scripts if a page-level signal is required.
