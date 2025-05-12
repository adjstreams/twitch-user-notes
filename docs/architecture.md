# Architecture

## Layer overview

| Layer | File(s) | Responsibility |
|-------|---------|----------------|
| **Service Worker** (MV3 background) | `src/background` | Registers context‑menu, listens for `PROMPT_NOTE`, syncs storage. Stateless; Chrome terminates it after ≈ 30 s idle. |
| **Content Script** | `src/content` | Injected on every `twitch.tv` page. Observes DOM mutations, tags username nodes, shows hover tooltips, exchanges messages with the background. |
| **Shared Utils** | `src/content/utils`, `src/storage.ts`, `src/selectors.ts` | Pure helpers — extract login, render tooltip, canonical selector list, storage wrapper. |
| **Popup / Options UI** | `src/popup`, `src/options` | Vite‑built Vue 3 UIs for quick settings and JSON import/export. Loaded on demand; no Twitch perms. |
| **Build & Tooling** | `vite.config.ts`, `scripts/**` | Vite + esbuild for TS→JS, manifest bump, semantic‑release, husky hooks. |

## Data flow

1. **Right‑click username** → content script dispatches `CTX_TARGET` with the login.  
2. **Background** receives, builds context‑menu → Chrome shows **Add / Edit note**.  
3. **User click** triggers `PROMPT_NOTE` back to the content script → native `prompt()` appears.  
4. **User submits note** → content script writes to `chrome.storage.local`.  
5. **Any page** showing that username reads the cache and displays a tooltip on hover.

## Permissions

| Permission | Why it’s needed |
|------------|-----------------|
| `storage` | Persist notes locally. |
| `contextMenus` | Inject right‑click menu item. |
| Host `https://www.twitch.tv/*` | Limit content‑script injection to Twitch pages. |
