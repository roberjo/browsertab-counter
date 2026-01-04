# ADR 0003: Repository Layout

## Status

Accepted

## Context

The project currently has minimal structure. We need a clear layout that separates background logic, UI, storage, and analytics, and scales as features are added.

## Decision

Use the following layout under `src/`:

- `src/background/` for the service worker and event listeners.
- `src/analytics/` for pure stats and aggregation logic.
- `src/storage/` for storage schema and persistence helpers.
- `src/ui/popup/` for popup UI.
- `src/ui/options/` for settings UI.

Static assets and the manifest live under `public/`:

- `public/manifest.json`
- `public/icons/`

## Consequences

- Developers can locate logic by responsibility quickly.
- UI code is isolated from background and storage internals.
- The manifest and assets remain stable and easy to inspect.
