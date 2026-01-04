export async function getCurrentTabCount(): Promise<number> {
  const tabs = await chrome.tabs.query({});
  return tabs.length;
}
