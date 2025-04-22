# 📝 Twitch User Notes

A lightweight Chrome extension to let you add personal notes to Twitch usernames. Hover over users in chat or browse pages and instantly remember why you followed them — or why you didn’t.

## ✨ Features

- Add/edit/delete notes for any Twitch username  
- Tooltips on hover across chat, sidebars, and cards  
- Notes synced with your browser storage (with usage meter)  
- Import/export support to back up or share notes  

## 🧙‍♂️ Why?

Because your Twitch follows list is full of mystery streamers and raid memories. This helps bring a little context back.

## 🚀 Install

Coming soon to the Chrome Web Store.  

In the meantime:

1. Grab the zip from the latest release, unzip somewhere.
2. Go to `chrome://extensions` and enable "Developer mode"  
3. Click "Load unpacked" and select the folder you unzipped

Alternatively, if you're a dev: clone the repo, build it and load umpacked from the dist folder.

## 🛠️ For Developers

This project is written in **TypeScript**, uses **Vitest** for unit testing, and aims for clean modular code with full coverage over time.

### Scripts

```bash
npm install            # install deps
npm run dev            # dev build with hot reload
npm run build          # production build to dist/
npm run lint           # lint check
npm run lint:fix       # lint + fix
npm run test           # run unit tests
npm run test:coverage  # check test coverage
npm run commit         # alias for npx cz commit (Commitzen prompt for good commit messages)
```

## 📂 Project Structure

```text
src/
├── background/       # Service worker logic
├── content/          # Tooltip injection into Twitch pages
├── options/          # Options/settings page logic
├── popup/            # Popup with link to options
├── scripts/          # Build scripts like setting manifest and package version
├── storage.ts        # Storage abstraction (Chrome/local)
├── types/            # Type definitions
├── __tests__/        # Unit tests
```

## 👋 About the Author

Built with ❤️ by [ADJ](https://adj.gg), also known as  
🎮 [adjstreams](https://twitch.tv/adjstreams) — variety streamer with chaotic energy  
🧘 [adjcodes](https://twitch.tv/adjcodes) — chill late-night dev streams  

This is one of many small tools created by the same dev behind [streamgood.gg](https://streamgood.gg) — a Twitch toolkit for streamers who want a little more magic.

Got feedback, ideas, or need help? [Open an issue](https://github.com/adjstreams/twitch-user-notes/issues).
