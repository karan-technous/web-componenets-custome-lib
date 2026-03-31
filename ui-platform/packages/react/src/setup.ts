import { initializeTheme } from "@ui-platform/web-components";
import { defineCustomElements } from "@ui-platform/web-components/loader";

let customElementsRegistered = false;

initializeTheme();

if (
  !customElementsRegistered &&
  typeof window !== "undefined" &&
  typeof customElements !== "undefined"
) {
  customElementsRegistered = true;
  void defineCustomElements();
}
