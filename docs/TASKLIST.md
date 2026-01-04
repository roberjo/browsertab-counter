# Development Tasklist

## Phase 1: Project Setup

- [x] Initialize `package.json` with `pnpm` scripts (build, test, lint, format).
- [x] Add Vite + TypeScript config for MV3 bundling.
- [x] Create `public/manifest.json` and minimal icons.
- [x] Establish `src/` layout per ADR 0003.

## Phase 2: Core Tab Counting

- [x] Implement background service worker to track open tab count.
- [x] Add listeners for `tabs.onCreated`, `tabs.onRemoved`, `tabs.onUpdated`.
- [x] Update extension badge with current count and color thresholds.
- [x] Persist raw counts in storage.

## Phase 3: Analytics & Aggregation

- [x] Implement pure aggregation functions (hourly, daily, weekly, monthly).
- [x] Add storage schema versioning and migration helpers.
- [x] Enforce 90-day rolling data retention window in storage and aggregation logic.
- [x] Write unit tests for aggregation logic.

## Phase 4: UI Surfaces

- [x] Build popup UI to show current count and recent stats.
- [x] Build options page to control thresholds and message toggles.
- [x] Add simple styling and accessibility checks.

## Phase 5: Messaging & Badges

- [x] Implement funny message rules and trigger logic.
- [x] Add badge color and text rules for milestones.
- [x] Ensure messages respect user settings.

## Phase 6: QA & Release Prep

- [x] Manual test plan for tab lifecycle edge cases.
- [ ] Verify storage cleanup and 90-day data rollover behavior.
- [ ] Create release zip process and update documentation.
- [x] Publish enterprise privacy policy and data retention statement.
