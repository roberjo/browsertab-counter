# ADR 0002: Extension Architecture (Manifest V3)

## Status

Accepted

## Context

The extension needs to track open tab counts over time, compute aggregates, and show badges/messages. It should be simple, reliable, and not overuse content scripts.

## Decision

- Use Manifest V3.
- Implement a background service worker for tab counting and aggregation.
- Keep analytics as pure functions separate from Chrome APIs.
- Use a storage module to encapsulate `chrome.storage` access.
- Add UI surfaces via a popup and an options page.
- Avoid content scripts unless a page-level signal becomes necessary.

## Consequences

- The service worker owns tab count updates and badge state.
- Aggregation logic is testable without Chrome APIs.
- Storage changes are centralized, easing schema changes.
- UI remains focused on display and settings, not heavy logic.
