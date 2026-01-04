import { getStats } from "../../storage/storage";

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

async function getCurrentTabCount(): Promise<number> {
  const tabs = await chrome.tabs.query({});
  return tabs.length;
}

function setText(id: string, value: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

async function loadStats(): Promise<void> {
  const [stats, count] = await Promise.all([getStats(), getCurrentTabCount()]);
  const now = new Date();
  const dayKey = formatDayKey(now);
  const weekKey = formatWeekKey(now);
  const monthKey = formatMonthKey(now);

  setText("current-count", String(count));
  setText("today-total", String(stats.dailyTotals[dayKey] ?? 0));
  setText("week-total", String(stats.weeklyTotals[weekKey] ?? 0));
  setText("month-total", String(stats.monthlyTotals[monthKey] ?? 0));
  setText("last-message", stats.lastMessage ?? "--");
}

document.addEventListener("DOMContentLoaded", () => {
  loadStats().catch(() => {
    setText("current-count", "--");
  });
});
