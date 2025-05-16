import { SELECTOR_METADATA } from "./selectorMetadata.js";

/**
 * A flattened list of all unique selectors across all contexts,
 * exported for use by the Twitch extension runtime.
 */
export const USERNAME_SELECTORS: string[] = Array.from(
  new Set(SELECTOR_METADATA.map((meta) => meta.selector)),
);
