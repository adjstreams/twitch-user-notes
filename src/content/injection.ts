import type { NotesMap, IStorageProvider } from "../types";
import { USERNAME_SELECTORS } from "./selectors";
import { extractLogin, showTooltip, hideTooltip } from "./domUtils";

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
let activeLogin: string | null = null;

/* ───── helper to avoid runtime errors ───── */
const safeSend = (msg: unknown): void => {
  try {
    chrome.runtime.sendMessage(msg);
  } catch {
    // silently ignore
  }
};

/* ───── tag Twitch usernames ───── */
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

/* ───── Main entry point with DI for testability ───── */
export function initNoteWatcher(storage: IStorageProvider): void {
  storage.get().then((notes) => {
    notesCache = notes;
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.notes) {
      notesCache = changes.notes.newValue || {};
    }
  });

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

    storage.set(notesCache);
  });

  // Observe DOM changes and tag username elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) =>
      m.addedNodes.forEach((node) => hookUsernameEl(node as HTMLElement)),
    );
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Initial sweep
  hookUsernameEl(document.body);

  // Clear context menu on right-click elsewhere
  document.addEventListener("contextmenu", (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (!e.target.closest("[data-note-hooked]")) {
      activeLogin = null;
      safeSend({ type: "CTX_CLEAR" });
    }
  });
}
