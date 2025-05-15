---
nav_order: 4
title: Testing
---

# Testing Strategy

This project takes a pragmatic approach to testing — fast, focused, and grounded in real-world behavior. Each layer is tested in the most reliable way possible given Chrome extension limitations.

---

## What We Test

| Layer                   | Framework          | Coverage Summary                                                                 |
|------------------------|--------------------|----------------------------------------------------------------------------------|
| **Pure utilities**     | Vitest + jsdom     | Snapshot tests for `selectors`, logic tests for `extractLogin`, tooltip rendering, etc. |
| **Extension injection**| Playwright (E2E)    | Local test run (`npm run e2e`) launches a persistent Chrome context and confirms the extension injects into Twitch pages, observes DOM mutations, tags usernames with notes, and renders tooltips correctly. |
| **DOM Integration**    | Playwright (smoke) | CI/CD check that verifies at least one username selector is still matching on Twitch pages. |
| **Nightly Regression** | GitHub Actions + Playwright | Scheduled smoketest detects Twitch DOM drift (e.g., layout or selector changes). |

---

## What We Don’t Test (And Why)

| Feature                        | Reason                                                                 |
|-------------------------------|------------------------------------------------------------------------|
| **Context menu UI**           | Native Chrome menus aren’t exposed to automation frameworks like Playwright. |
| **`prompt()` note editing**   | `prompt()` blocks execution in headless browsers; tested via isolated logic. |
| **Service worker lifetime**   | MV3 background scripts are unloaded after ~30 seconds idle. Messaging logic is unit-tested instead of E2E tested. |

---

## CI/CD Integration

- **`npm test`**: Runs unit tests via Vitest on every commit and push
- **Smoketests**: Scheduled GitHub Action detects if Twitch selectors change unexpectedly
- **Alerts**: Failing smoketests automatically open a GitHub issue with the affected selectors

---

## 🔧 Common Test Commands

```bash
npm run test             # Run all unit tests
npm run test:coverage    # Show coverage report
npm run e2e              # Local-only Playwright test validates real extension behaviour
npm run smoketest        # Check if Twitch selectors are still valid
HEADLESS=false npm run smoketest   # Run smoketest with visible browser