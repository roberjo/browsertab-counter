import { describe, expect, it } from "vitest";
import { RETENTION_DAYS, pruneStats, recordCount } from "./aggregations";
import type { StatsState } from "../storage/types";

const emptyStats: StatsState = {
  schemaVersion: 1,
  countsByHour: {},
  dailyTotals: {},
  weeklyTotals: {},
  monthlyTotals: {},
  lastMessageKey: null,
  lastMessage: null,
  lastMessageAt: null
};

function hourKey(date: Date): string {
  return date.toISOString().slice(0, 13);
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

function weekKey(date: Date): string {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

describe("recordCount", () => {
  it("prunes counts older than the retention window", () => {
    const now = new Date("2026-01-10T12:00:00.000Z");
    const old = new Date(now.getTime() - (RETENTION_DAYS + 1) * 24 * 60 * 60 * 1000);
    const oldKey = hourKey(old);
    const nowKey = hourKey(now);

    const updated = recordCount(
      { ...emptyStats, countsByHour: { [oldKey]: 5 } },
      3,
      now
    );

    expect(updated.countsByHour[oldKey]).toBeUndefined();
    expect(updated.countsByHour[nowKey]).toBe(3);
    expect(updated.dailyTotals[dayKey(now)]).toBe(3);
  });
});

describe("pruneStats", () => {
  it("recomputes totals after pruning", () => {
    const now = new Date("2026-01-10T12:00:00.000Z");
    const day = new Date("2026-01-08T01:00:00.000Z");
    const dayLater = new Date("2026-01-08T02:00:00.000Z");
    const old = new Date(now.getTime() - (RETENTION_DAYS + 5) * 24 * 60 * 60 * 1000);

    const stats: StatsState = {
      ...emptyStats,
      countsByHour: {
        [hourKey(day)]: 2,
        [hourKey(dayLater)]: 4,
        [hourKey(old)]: 9
      }
    };

    const pruned = pruneStats(stats, now);

    expect(Object.keys(pruned.countsByHour)).toHaveLength(2);
    expect(pruned.dailyTotals[dayKey(day)]).toBe(6);
    expect(pruned.weeklyTotals[weekKey(day)]).toBe(6);
    expect(pruned.monthlyTotals[monthKey(day)]).toBe(6);
  });
});
