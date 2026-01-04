export type StatsState = {
  schemaVersion: number;
  countsByHour: Record<string, number>;
  dailyTotals: Record<string, number>;
  weeklyTotals: Record<string, number>;
  monthlyTotals: Record<string, number>;
  lastMessageKey: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
};

export type SettingsState = {
  badgeMediumThreshold: number;
  badgeHighThreshold: number;
  messagesEnabled: boolean;
};

export type StorageState = {
  stats: StatsState;
  settings: SettingsState;
};
