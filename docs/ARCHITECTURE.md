# Architecture Overview

## Goals

- Track current tab count and historical aggregates.
- Provide lighthearted badges and messages without heavy UI.
- Keep logic testable and Chrome API usage minimal.

## High-Level Design

- Background service worker listens to tab events and updates counts.
- Analytics module computes hourly, daily, weekly, and monthly summaries.
- Storage module manages schema and persistence in `chrome.storage.local`.
- Popup UI displays current stats and recent message triggers.
- Options UI controls thresholds and message toggles.

## Module Responsibilities

- `src/background/`: tab event listeners, badge updates, scheduling.
- `src/analytics/`: pure functions for stats aggregation.
- `src/storage/`: get/set helpers, migrations, schema version.
- `src/ui/popup/`: summary display and quick status.
- `src/ui/options/`: user preferences and configuration.

## Data Model (Proposed)

- `schemaVersion`: number
- `countsByHour`: map keyed by YYYY-MM-DDTHH
- `dailyTotals`: map keyed by YYYY-MM-DD
- `weeklyTotals`: map keyed by YYYY-[W]WW
- `monthlyTotals`: map keyed by YYYY-MM
- `settings`: message toggles, badge thresholds

## Chrome APIs

- `chrome.tabs` for tab count updates.
- `chrome.storage.local` for persistence.
- `chrome.action` for badge text and color.
