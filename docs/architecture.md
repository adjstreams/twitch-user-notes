---
nav_order: 2
title: Architecture
---

# Architecture

## Layer Overview

| Layer                      | File(s)                              | Responsibility                                                                 |
|---------------------------|--------------------------------------|--------------------------------------------------------------------------------|
| **Service Worker**        | `src/background`                     | Registers the context menu, handles `PROMPT_NOTE` messages, syncs storage. Stateless by design (MV3 kills idle workers). |
| **Content Script**        | `src/content`                        | Injected into all `twitch.tv` pages. Observes DOM mutations, tags usernames, displays tooltips, and communicates with background. |
| **Shared Utilities**      | `src/content/utils`, `src/selectors.ts`, `src/storage.ts` | Pure functions for login extraction, tooltip rendering, selector listing, and storage access. |
| **Popup / Options UI**    | `src/popup`, `src/options`           | Built with Vite. Vue 3 UIs for settings and JSON import/export. Only loads on UI demand — no Twitch permissions needed. |
| **Build & Tooling**       | `vite.config.ts`, `scripts/`, `.github/` | Handles TS → JS via Vite, manifest bumping, lint/test hooks, semantic-release, CI, etc. |

---

## Data Flow (Right-Click UX)

1. **Right-click on username** → content script sends `CTX_TARGET` with the login.
2. **Background** listens and sets up a context menu for “Add/Edit Note”.
3. **User clicks** the item → background sends `PROMPT_NOTE` back to the content script.
4. **Content script** prompts user via native `prompt()` → stores note in `chrome.storage.local`.
5. **Any page** showing that username then renders the tooltip based on local cache.

---

## Chrome Extension Permissions

| Permission                  | Purpose                                  |
|----------------------------|------------------------------------------|
| `storage`                  | Used to persist user notes locally.      |
| `contextMenus`             | Enables right-click "Add/Edit Note".     |
| `https://www.twitch.tv/*`  | Limits content script to Twitch pages.   |
