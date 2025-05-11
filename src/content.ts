import type { NotesMap } from "./types";
import { USERNAME_SELECTORS } from "./selectors";
import { extractLogin, showTooltip, hideTooltip } from "./content/utils";

/* ───── guard for embedded frames without extension APIs ───── */
if (!window.chrome?.runtime?.sendMessage) {
  // Prevent running in iframes or early-loaded pages
  throw new Error("Chrome extension API not available");
}

/* ───── helper to avoid errors if runtime is unavailable ───── */
const safeSend = (msg: unknown): void => {
  try {
    chrome.runtime.sendMessage(msg);
  } catch {
    // silently ignore
  }
};

/* ───── tooltip CSS (injected once) ───── */
if (!document.getElementById("tw-notes-style")) {
  const style = document.createElement("style");
  style.id = "tw-notes-style";
  style.textContent =
    ".note-tooltip{position:fixed;max-width:280px;padding:6px 8px;background:#18181b;color:#fff;border:1px solid #6b7280;border-radius:6px;font-size:12px;line-height:1.4;z-index:100000;pointer-events:none;white-space:pre-wrap}";
  document.head.appendChild(style);
}

/* ───── notes cache ───── */
let notesCache: NotesMap = {};

chrome.storage.local.get(["notes"], (d) => {
  notesCache = d.notes || {};
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.notes) {
    notesCache = changes.notes.newValue || {};
  }
});

/* ───── track which login is under the pointer ───── */
let activeLogin: string | null = null;

/* ───── observe DOM churn ───── */
const observer = new MutationObserver((mutations) => {
  mutations.forEach((m) =>
    m.addedNodes.forEach((node) => hookUsernameEl(node as HTMLElement)),
  );
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// initial sweep
hookUsernameEl(document.body);

/* clear the menu when right-clicking outside hooked elements */
document.addEventListener("contextmenu", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  if (!e.target.closest("[data-note-hooked]")) {
    activeLogin = null;
    safeSend({ type: "CTX_CLEAR" });
  }
});

/* ───── core: tag username elements ───── */
function hookUsernameEl(node: HTMLElement): void {
  if (!(node instanceof HTMLElement)) return;

  const joined = USERNAME_SELECTORS.join(",");

  const candidates = node.matches?.(joined)
    ? [node]
    : Array.from(node.querySelectorAll<HTMLElement>(joined));

  candidates.forEach((el) => {
    if (el.dataset.noteHooked) return;

    const login = extractLogin(el);
    if (!login) return;

    el.dataset.noteHooked = "1";

    el.addEventListener("mouseenter", (ev: MouseEvent) => {
      const note = notesCache[login]?.note;
      if (note) showTooltip(ev, note);

      if (activeLogin !== login) {
        activeLogin = login;
        safeSend({ type: "CTX_TARGET", login });
      }
    });

    el.addEventListener("mouseleave", () => {
      hideTooltip();
      if (activeLogin === login) {
        activeLogin = null;
        safeSend({ type: "CTX_CLEAR" });
      }
    });
  });
}

/* ───── respond to PROMPT_NOTE from background ───── */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type !== "PROMPT_NOTE") return;

  const { login } = msg;
  const current = notesCache[login]?.note || "";
  const result = prompt(`Note for ${login}:`, current);

  if (result === null) return;

  if (!result.trim()) {
    delete notesCache[login];
  } else {
    notesCache[login] = {
      note: result.trim(),
      update_date: new Date().toISOString(),
    };
  }

  chrome.storage.local.set({ notes: notesCache });
});
