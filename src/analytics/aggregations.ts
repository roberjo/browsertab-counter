import type { StatsState } from "../storage/types";

export const RETENTION_DAYS = 90;
const RETENTION_WINDOW_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

function formatHourKey(date: Date): string {
  return date.toISOString().slice(0, 13);
}

function formatDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

function formatWeekKey(date: Date): string {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function parseHourKey(hourKey: string): Date {
  return new Date(`${hourKey}:00:00.000Z`);
}

function pruneCountsByHour(
  countsByHour: Record<string, number>,
  timestamp: Date
): Record<string, number> {
  const cutoff = new Date(timestamp.getTime() - RETENTION_WINDOW_MS);
  const pruned: Record<string, number> = {};
  for (const [hourKey, count] of Object.entries(countsByHour)) {
    if (parseHourKey(hourKey) >= cutoff) {
      pruned[hourKey] = count;
    }
  }
  return pruned;
}

function rebuildTotals(countsByHour: Record<string, number>): {
  dailyTotals: Record<string, number>;
  weeklyTotals: Record<string, number>;
  monthlyTotals: Record<string, number>;
} {
  const dailyTotals: Record<string, number> = {};
  const weeklyTotals: Record<string, number> = {};
  const monthlyTotals: Record<string, number> = {};

  for (const [hourKey, count] of Object.entries(countsByHour)) {
    const timestamp = parseHourKey(hourKey);
    const dayKey = formatDayKey(timestamp);
    const weekKey = formatWeekKey(timestamp);
    const monthKey = formatMonthKey(timestamp);

    dailyTotals[dayKey] = (dailyTotals[dayKey] ?? 0) + count;
    weeklyTotals[weekKey] = (weeklyTotals[weekKey] ?? 0) + count;
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] ?? 0) + count;
  }

  return { dailyTotals, weeklyTotals, monthlyTotals };
}

export function pruneStats(stats: StatsState, timestamp: Date): StatsState {
  const countsByHour = pruneCountsByHour(stats.countsByHour, timestamp);
  const { dailyTotals, weeklyTotals, monthlyTotals } = rebuildTotals(countsByHour);

  return {
    ...stats,
    schemaVersion: 2,
    countsByHour,
    dailyTotals,
    weeklyTotals,
    monthlyTotals
  };
}

export function recordCount(
  stats: StatsState,
  count: number,
  timestamp: Date
): StatsState {
  const hourKey = formatHourKey(timestamp);
  const countsByHour = pruneCountsByHour(
    { ...stats.countsByHour, [hourKey]: count },
    timestamp
  );
  const { dailyTotals, weeklyTotals, monthlyTotals } = rebuildTotals(countsByHour);

  return {
    ...stats,
    schemaVersion: 2,
    countsByHour,
    dailyTotals,
    weeklyTotals,
    monthlyTotals
  };
}
