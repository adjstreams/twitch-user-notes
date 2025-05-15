/* background.ts – Twitch Notes */
let lastLogin: string | null = null;

const CONTEXT_MENU_ID = "tw-edit-note";

/**
 * Ensure the context menu item exists.
 * Tries to update first (cheap), creates if it doesn't exist.
 */
function ensureMenu(): void {
  chrome.contextMenus.update(CONTEXT_MENU_ID, { visible: false }, () => {
    if (chrome.runtime.lastError) {
      chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: "Add / Edit note",
        contexts: ["link", "page", "selection"],
        visible: false,
      });
    }
  });
}

/**
 * Update context menu safely. If it doesn't exist, retry after creating it.
 */
function safeUpdateMenu(
  props: Parameters<typeof chrome.contextMenus.update>[1],
): void {
  chrome.contextMenus.update(CONTEXT_MENU_ID, props, () => {
    if (chrome.runtime.lastError) {
      ensureMenu();
      chrome.contextMenus.update(CONTEXT_MENU_ID, props);
    }
  });
}

// Try to create/restore the menu on service worker start
ensureMenu();

// Create it on fresh installs or updates
chrome.runtime.onInstalled.addListener(() => ensureMenu());

/**
 * Handle context menu clicks.
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (
    info.menuItemId === CONTEXT_MENU_ID &&
    lastLogin &&
    tab?.id !== undefined
  ) {
    chrome.tabs.sendMessage(tab.id, {
      type: "PROMPT_NOTE",
      login: lastLogin,
    });
  }
});

/**
 * Handle messages from content script.
 */
chrome.runtime.onMessage.addListener(
  (msg: { type: string; login?: string }) => {
    switch (msg?.type) {
      case "CTX_TARGET":
        lastLogin = msg.login ?? null;
        safeUpdateMenu({
          title: `Add / Edit note for ${lastLogin}`,
          visible: true,
        });
        break;

      case "CTX_CLEAR":
        lastLogin = null;
        safeUpdateMenu({ visible: false });
        break;
    }
  },
);

export {};
