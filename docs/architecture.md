---
nav_order: 2
title: Architecture
---

# Architecture

## Architecture Layers

This extension is split into distinct layers for clarity and separation of concerns:

| Layer             | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| **Service Worker** | Handles the context menu and background messaging (chrome.runtime.onMessage) between scripts.         |
| **Content Script** | Injected into Twitch pages. Observes DOM, tags usernames, and renders tooltips. |
| **Options UI**     | Displays and manages notes, including import/export and editing.       |
| **Popup Script**   | Opens the options page from the Chrome extension menu.                     |
| **Utilities**      | Shared logic for login detection, DOM interaction, storage, and rendering. |

---

## Project Structure

| Folder            | Purpose                                                  |
|-------------------|----------------------------------------------------------|
| `src/background/` | Service worker logic for context menu                    |
| `src/content/`    | DOM observers and Twitch injection logic                 |
| `src/options/`    | Options page UI + note management logic                  |
| `src/popup/`      | Simple popup to open options                             |
| `public/`         | Manifest, icons, and static assets                       |
| `scripts/`        | CI/CD helper scripts (e.g., version bump, zip builder)  |
| `docs/`           | Dev and user-facing documentation                        |
| `__tests__/`      | Vitest unit tests and Playwright E2E tests                              |

---

## Note-Taking Flow: Right-Click UX

This is the typical flow for adding or editing a note from a Twitch chat or user element.

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
