import type { SettingsState, StatsState, StorageState } from "./types";

const STORAGE_KEY = "tabCounterState";

const defaultStats: StatsState = {
  schemaVersion: 1,
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

export async function getState(): Promise<StorageState> {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const state = stored[STORAGE_KEY] as StorageState | undefined;
  if (!state) {
    await chrome.storage.local.set({ [STORAGE_KEY]: defaultState });
    return defaultState;
  }
  return state;
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
