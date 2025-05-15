export function openOptionsAndClose(): void {
  chrome.runtime.openOptionsPage();
  window.close();
}
