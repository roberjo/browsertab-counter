# Development Tasklist

## Phase 1: Project Setup

- Initialize `package.json` with `pnpm` scripts (build, test, lint, format).
- Add Vite + TypeScript config for MV3 bundling.
- Create `public/manifest.json` and minimal icons.
- Establish `src/` layout per ADR 0003.

## Phase 2: Core Tab Counting

- Implement background service worker to track open tab count.
- Add listeners for `tabs.onCreated`, `tabs.onRemoved`, `tabs.onUpdated`.
- Update extension badge with current count and color thresholds.
- Persist raw counts in storage.

## Phase 3: Analytics & Aggregation

- Implement pure aggregation functions (hourly, daily, weekly, monthly).
- Add storage schema versioning and migration helpers.
- Write unit tests for aggregation logic.

## Phase 4: UI Surfaces

- Build popup UI to show current count and recent stats.
- Build options page to control thresholds and message toggles.
- Add simple styling and accessibility checks.

## Phase 5: Messaging & Badges

- Implement funny message rules and trigger logic.
- Add badge color and text rules for milestones.
- Ensure messages respect user settings.

## Phase 6: QA & Release Prep

- Manual test plan for tab lifecycle edge cases.
- Verify storage cleanup and data rollover.
- Create release zip process and update documentation.
