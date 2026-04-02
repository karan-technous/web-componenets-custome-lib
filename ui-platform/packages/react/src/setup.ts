import { initializeTheme } from "@karan9186/web-components";
import { defineCustomElements } from "@karan9186/web-components/loader";

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
