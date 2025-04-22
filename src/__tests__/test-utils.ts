export interface MockChrome {
  runtime?: {
    onInstalled?: {
      addListener: (cb: () => void) => void;
    };
    onMessage?: {
      addListener: (
        cb: (msg: { type: string; login?: string }) => void,
      ) => void;
    };
    openOptionsPage?: () => void;
    lastError?: { message?: string } | null; // ← allows setting error message
  };
  contextMenus?: {
    update: (
      id: string,
      props: Record<string, unknown>,
      callback?: () => void,
    ) => void;
    create: (props: Record<string, unknown>) => void;
    onClicked?: {
      addListener: (
        cb: (info: { menuItemId: string }, tab: { id: number }) => void,
      ) => void;
    };
  };
  tabs?: {
    sendMessage: (tabId: number, msg: unknown) => void;
  };
  storage?: {
    local?: {
      set?: (data: Record<string, unknown>) => void;
    };
  };
}
