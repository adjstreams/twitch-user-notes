export type SelectorContext =
  | "homepage"
  | "channelWatch"
  | "channelHome"
  | "sidebarCollapsed";

export interface SelectorMeta {
  selector: string;
  contexts: SelectorContext[];
  description?: string;
  smoketest?: boolean; // default is true, set to false to exclude
}

export const SELECTOR_METADATA: SelectorMeta[] = [
  // Chat usernames
  {
    selector: '[data-a-target="chat-message-username"]',
    contexts: ["channelWatch"],
    description: "Username in chat messages",
  },

  // Browse / front-page cards
  {
    selector: 'a[data-a-target="preview-card-channel-link"]',
    contexts: ["homepage"],
    description: "Channel preview card on homepage or browse page",
  },

  // Sidebar channels (left nav)
  {
    selector: 'a[data-test-selector="followed-channel"]',
    contexts: ["homepage"],
    description: "Sidebar followed channel link (requires login)",
    smoketest: false,
  },
  {
    selector: 'a[data-test-selector="recommended-channel"]',
    contexts: ["homepage"],
    description: "Sidebar recommended channel link",
  },
  {
    selector: '[data-a-target="side-nav-title"]',
    contexts: ["homepage"],
    description: "Sidebar channel title in compact mode",
  },
  {
    selector: "a.side-nav-card.tw-link",
    contexts: ["sidebarCollapsed"],
    description: "Sidebar link when nav is collapsed",
  },

  // Channel headers (titles)
  {
    selector: ".channel-root--watch h1.tw-title",
    contexts: ["channelWatch"],
    description: "Title element on the stream watch page (default landing)",
  },
  {
    selector: ".channel-root--home h1.tw-title",
    contexts: ["channelHome"],
    description:
      "Title element after clicking channel name to reach profile view",
  },
];
