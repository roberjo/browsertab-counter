# ADR 0001: Tooling and Build System

## Status

Accepted

## Context

The project is a small Chrome extension that tracks tab counts, aggregates stats, and shows badges/messages. We need fast local iteration, reliable bundling for MV3, and light maintenance overhead.

## Decision

- Use `pnpm` as the package manager.
- Use `Vite` for bundling and dev builds.
- Use `TypeScript` to reduce Chrome API errors.
- Use `eslint` and `prettier` for linting and formatting.
- Use `vitest` for unit tests of pure logic.
- Use a simple `zip` script (or `web-ext` later) for packaging releases.

## Consequences

- Developers get quick rebuilds and a minimal config surface area.
- Type safety reduces runtime surprises in service worker and UI code.
- Tooling adds a small up-front setup cost but improves consistency.
- Tests remain fast because UI and Chrome APIs are kept out of unit tests.
