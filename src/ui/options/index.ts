import { getSettings, saveSettings } from "../../storage/storage";
import type { SettingsState } from "../../storage/types";

function setValue(id: string, value: string): void {
  const element = document.getElementById(id) as HTMLInputElement | null;
  if (element) {
    element.value = value;
  }
}

function setChecked(id: string, checked: boolean): void {
  const element = document.getElementById(id) as HTMLInputElement | null;
  if (element) {
    element.checked = checked;
  }
}

function getNumberValue(id: string): number {
  const element = document.getElementById(id) as HTMLInputElement | null;
  if (!element) {
    return 0;
  }
  return Number.parseInt(element.value, 10);
}

function getChecked(id: string): boolean {
  const element = document.getElementById(id) as HTMLInputElement | null;
  return element ? element.checked : false;
}

function normalizeSettings(input: SettingsState): SettingsState {
  const badgeMediumThreshold = Number.isFinite(input.badgeMediumThreshold)
    ? input.badgeMediumThreshold
    : 20;
  const badgeHighThreshold = Number.isFinite(input.badgeHighThreshold)
    ? input.badgeHighThreshold
    : 30;

  return {
    badgeMediumThreshold: Math.max(1, badgeMediumThreshold),
    badgeHighThreshold: Math.max(badgeMediumThreshold, badgeHighThreshold),
    messagesEnabled: input.messagesEnabled
  };
}

async function loadSettings(): Promise<void> {
  const settings = await getSettings();
  setValue("badge-medium", String(settings.badgeMediumThreshold));
  setValue("badge-high", String(settings.badgeHighThreshold));
  setChecked("messages-enabled", settings.messagesEnabled);
}

async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault();

  const candidate: SettingsState = {
    badgeMediumThreshold: getNumberValue("badge-medium"),
    badgeHighThreshold: getNumberValue("badge-high"),
    messagesEnabled: getChecked("messages-enabled")
  };

  const normalized = normalizeSettings(candidate);
  await saveSettings(normalized);
  setValue("badge-medium", String(normalized.badgeMediumThreshold));
  setValue("badge-high", String(normalized.badgeHighThreshold));
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settings-form") as HTMLFormElement | null;
  if (form) {
    form.addEventListener("submit", (event) => {
      handleSubmit(event).catch(() => {
        // Swallow save errors to keep the UI responsive.
      });
    });
  }

  loadSettings().catch(() => {
    // Ignore load errors for now.
  });
});
