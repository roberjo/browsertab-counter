import { pruneStats } from "../analytics/aggregations";
import type { SettingsState, StatsState, StorageState } from "./types";

const STORAGE_KEY = "tabCounterState";

const CURRENT_SCHEMA_VERSION = 2;

const defaultStats: StatsState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  countsByHour: {},
  dailyTotals: {},
  weeklyTotals: {},
  monthlyTotals: {},
  lastMessageKey: null,
  lastMessage: null,
  lastMessageAt: null
};

const defaultSettings: SettingsState = {
  badgeMediumThreshold: 20,
  badgeHighThreshold: 30,
  messagesEnabled: true
};

const defaultState: StorageState = {
  stats: defaultStats,
  settings: defaultSettings
};

function normalizeStats(stats: StatsState | undefined): { stats: StatsState; changed: boolean } {
  if (!stats) {
    return { stats: defaultStats, changed: true };
  }

  const normalized: StatsState = {
    schemaVersion: stats.schemaVersion ?? 1,
    countsByHour: stats.countsByHour ?? {},
    dailyTotals: stats.dailyTotals ?? {},
    weeklyTotals: stats.weeklyTotals ?? {},
    monthlyTotals: stats.monthlyTotals ?? {},
    lastMessageKey: stats.lastMessageKey ?? null,
    lastMessage: stats.lastMessage ?? null,
    lastMessageAt: stats.lastMessageAt ?? null
  };

  const changed =
    stats.schemaVersion !== normalized.schemaVersion ||
    stats.countsByHour !== normalized.countsByHour ||
    stats.dailyTotals !== normalized.dailyTotals ||
    stats.weeklyTotals !== normalized.weeklyTotals ||
    stats.monthlyTotals !== normalized.monthlyTotals ||
    stats.lastMessageKey !== normalized.lastMessageKey ||
    stats.lastMessage !== normalized.lastMessage ||
    stats.lastMessageAt !== normalized.lastMessageAt;

  return { stats: normalized, changed };
}

function normalizeSettings(
  settings: SettingsState | undefined
): { settings: SettingsState; changed: boolean } {
  if (!settings) {
    return { settings: defaultSettings, changed: true };
  }

  const normalized: SettingsState = {
    badgeMediumThreshold: Number.isFinite(settings.badgeMediumThreshold)
      ? settings.badgeMediumThreshold
      : defaultSettings.badgeMediumThreshold,
    badgeHighThreshold: Number.isFinite(settings.badgeHighThreshold)
      ? settings.badgeHighThreshold
      : defaultSettings.badgeHighThreshold,
    messagesEnabled: settings.messagesEnabled ?? defaultSettings.messagesEnabled
  };

  const changed =
    settings.badgeMediumThreshold !== normalized.badgeMediumThreshold ||
    settings.badgeHighThreshold !== normalized.badgeHighThreshold ||
    settings.messagesEnabled !== normalized.messagesEnabled;

  return { settings: normalized, changed };
}

function migrateStats(stats: StatsState, now: Date): { stats: StatsState; changed: boolean } {
  if (stats.schemaVersion < CURRENT_SCHEMA_VERSION) {
    const migrated = pruneStats({ ...stats, schemaVersion: CURRENT_SCHEMA_VERSION }, now);
    return { stats: migrated, changed: true };
  }

  const pruned = pruneStats(stats, now);
  const changed = Object.keys(pruned.countsByHour).length !== Object.keys(stats.countsByHour).length;
  return { stats: changed ? pruned : stats, changed };
}

export async function getState(): Promise<StorageState> {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const state = stored[STORAGE_KEY] as StorageState | undefined;
  if (!state) {
    await chrome.storage.local.set({ [STORAGE_KEY]: defaultState });
    return defaultState;
  }

  const now = new Date();
  const normalizedStats = normalizeStats(state.stats);
  const normalizedSettings = normalizeSettings(state.settings);
  const migratedStats = migrateStats(normalizedStats.stats, now);

  const next: StorageState = {
    stats: migratedStats.stats,
    settings: normalizedSettings.settings
  };

  if (normalizedStats.changed || normalizedSettings.changed || migratedStats.changed) {
    await chrome.storage.local.set({ [STORAGE_KEY]: next });
  }

  return next;
}

export async function getStats(): Promise<StatsState> {
  const state = await getState();
  return state.stats;
}

export async function getSettings(): Promise<SettingsState> {
  const state = await getState();
  return state.settings;
}

export async function saveStats(stats: StatsState): Promise<void> {
  const state = await getState();
  const next = { ...state, stats };
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
}

export async function saveSettings(settings: SettingsState): Promise<void> {
  const state = await getState();
  const next = { ...state, settings };
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
}
