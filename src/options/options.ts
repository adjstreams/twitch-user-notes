import { render } from "./render";
import { initApp, initDOMHandlers } from "./init";

if (typeof document !== "undefined") {
  initApp();
  initDOMHandlers();
}

export { render };
