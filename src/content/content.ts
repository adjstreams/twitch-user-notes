import { initNoteWatcher } from "./injection";
import { ChromeStorage } from "../storage/chromeStorage?cs"; // force Rollup to treat this as unique import

initNoteWatcher(new ChromeStorage());
