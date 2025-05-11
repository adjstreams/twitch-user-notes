# Testing & Limitations

| Layer | Framework | What we cover |
|-------|-----------|---------------|
| **Vitest + jsdom** | selectors snapshot, `extractLogin`, tooltip helpers |
| **Playwright smoke** | extension injects and tags at least one username in pop-out chat |
| **Nightly drift job** | headless Playwright checks that ≥ 1 selector still matches today’s twitch.tv |

## Not automated (and why)

* **Native context menu UI** – Chrome's menus aren’t exposed to automation.
* **`prompt()` dialog** – blocks headless browsers; logic unit-tested instead.
* **MV3 worker lifetime** – service-worker dies after ~30 s idle; messaging paths covered in unit tests.