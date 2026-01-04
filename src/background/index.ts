import { getSettings, getStats, saveStats } from "../storage/storage";
import { recordCount } from "../analytics/aggregations";
import { getCurrentTabCount } from "./tabs";
import { getMessageForCount } from "../messages/rules";

async function updateFromCurrentTabs(): Promise<void> {
  const [stats, settings, currentCount] = await Promise.all([
    getStats(),
    getSettings(),
    getCurrentTabCount()
  ]);

  const now = new Date();
  let updated = recordCount(stats, currentCount, now);
  if (settings.messagesEnabled) {
    const message = getMessageForCount(currentCount);
    if (message && message.key !== updated.lastMessageKey) {
      updated = {
        ...updated,
        lastMessageKey: message.key,
        lastMessage: message.message,
        lastMessageAt: now.toISOString()
      };
    }
  }
  await saveStats(updated);

  const badgeText = String(currentCount);
  chrome.action.setBadgeText({ text: badgeText });
  let badgeColor = "#175CD3";
  if (currentCount >= settings.badgeHighThreshold) {
    badgeColor = "#B42318";
  } else if (currentCount >= settings.badgeMediumThreshold) {
    badgeColor = "#B54708";
  }
  chrome.action.setBadgeBackgroundColor({ color: badgeColor });
}

chrome.runtime.onInstalled.addListener(() => {
  updateFromCurrentTabs().catch(() => {
    // Swallow startup errors to avoid breaking the worker.
  });
});

chrome.tabs.onCreated.addListener(() => {
  updateFromCurrentTabs().catch(() => {
    // Avoid unhandled rejections from background events.
  });
});

chrome.tabs.onRemoved.addListener(() => {
  updateFromCurrentTabs().catch(() => {
    // Avoid unhandled rejections from background events.
  });
});

chrome.tabs.onUpdated.addListener(() => {
  updateFromCurrentTabs().catch(() => {
    // Avoid unhandled rejections from background events.
  });
});
