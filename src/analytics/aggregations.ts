import type { StatsState } from "../storage/types";

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

function sumForDay(countsByHour: Record<string, number>, dayKey: string): number {
  let total = 0;
  for (const [hourKey, count] of Object.entries(countsByHour)) {
    if (hourKey.startsWith(dayKey)) {
      total += count;
    }
  }
  return total;
}

function sumForMonth(countsByHour: Record<string, number>, monthKey: string): number {
  let total = 0;
  for (const [hourKey, count] of Object.entries(countsByHour)) {
    if (hourKey.startsWith(monthKey)) {
      total += count;
    }
  }
  return total;
}

function sumForWeek(countsByHour: Record<string, number>, weekKey: string): number {
  let total = 0;
  for (const [hourKey, count] of Object.entries(countsByHour)) {
    const week = formatWeekKey(parseHourKey(hourKey));
    if (week === weekKey) {
      total += count;
    }
  }
  return total;
}

export function recordCount(
  stats: StatsState,
  count: number,
  timestamp: Date
): StatsState {
  const hourKey = formatHourKey(timestamp);
  const dayKey = formatDayKey(timestamp);
  const weekKey = formatWeekKey(timestamp);
  const monthKey = formatMonthKey(timestamp);

  const countsByHour = { ...stats.countsByHour, [hourKey]: count };

  return {
    ...stats,
    countsByHour,
    dailyTotals: {
      ...stats.dailyTotals,
      [dayKey]: sumForDay(countsByHour, dayKey)
    },
    weeklyTotals: {
      ...stats.weeklyTotals,
      [weekKey]: sumForWeek(countsByHour, weekKey)
    },
    monthlyTotals: {
      ...stats.monthlyTotals,
      [monthKey]: sumForMonth(countsByHour, monthKey)
    }
  };
}
