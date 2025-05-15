import { vi } from "vitest";
import { NotesMap } from "@src/types";

type StorageData = {
  [key: string]: NotesMap;
};

export function mockChromeStorage(data: StorageData = {}) {
  const store: StorageData = { ...data };

  const get = vi.fn(
    (keys: string | string[], cb: (res: StorageData) => void) => {
      const result: StorageData = {};

      if (typeof keys === "string") {
        result[keys] = store[keys];
      } else if (Array.isArray(keys)) {
        keys.forEach((key) => {
          result[key] = store[key];
        });
      }

      cb(result);
    },
  );

  const set = vi.fn((items: StorageData, cb?: () => void) => {
    Object.assign(store, items);
    cb?.();
  });

  const remove = vi.fn((keys: string | string[], cb?: () => void) => {
    if (Array.isArray(keys)) {
      keys.forEach((key) => delete store[key]);
    } else {
      delete store[keys];
    }
    cb?.();
  });

  const getBytesInUse = vi.fn(
    (keys: string | string[], cb: (bytes: number) => void) => {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const used = keysArray.reduce((sum, key) => {
        const raw = JSON.stringify(store[key] ?? "");
        return sum + new Blob([raw]).size;
      }, 0);
      cb(used);
    },
  );

  globalThis.chrome = {
    storage: {
      local: {
        get,
        set,
        remove,
        getBytesInUse,
      },
      sync: {
        get,
        set,
        remove,
      },
    },
  } as unknown as typeof chrome;
}
