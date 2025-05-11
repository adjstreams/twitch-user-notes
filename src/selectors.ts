export const USERNAME_SELECTORS = [
  // Chat messages
  '[data-a-target="chat-message-username"]',

  // Browse / front-page cards
  'a[data-a-target="preview-card-channel-link"]',

  // Left rail – expanded
  'a[data-test-selector="followed-channel"]',
  'a[data-test-selector="recommended-channel"]',
  '[data-a-target="side-nav-title"]',

  // Left rail – collapsed
  "a.side-nav-card.tw-link",
] as const;
