import { ChromeStorage } from "./chromeStorage?bg";
import type { IStorageProvider } from "../types";

export const storage: IStorageProvider = new ChromeStorage();
