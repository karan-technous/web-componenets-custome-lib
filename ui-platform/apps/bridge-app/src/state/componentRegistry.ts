import type { Framework } from "./frameworkStore";

export interface ReactComponentBinding {
  exportName: string;
  childrenProp?: string;
}

export interface AngularComponentBinding {
  selector: string;
  exportName?: string;
  projectedProp?: string;
  imports?: string[];
}

export interface WcComponentBinding {
  tagName: string;
  textProp?: string;
}

export interface ComponentRegistryEntry {
  react: ReactComponentBinding;
  angular: AngularComponentBinding;
  wc: WcComponentBinding;
}

export type ComponentRegistry = Record<string, ComponentRegistryEntry>;

export const componentRegistry: ComponentRegistry = {
  badge: {
    react: { exportName: "Badge", childrenProp: "children" },
    angular: {
      selector: "ui-badge-wrapper",
      exportName: "BadgeComponent",
      projectedProp: "children",
      imports: ["BadgeComponent"],
    },
    wc: { tagName: "ui-badge", textProp: "children" },
  },
  breadcrumb: {
    react: { exportName: "Breadcrumb", childrenProp: "children" },
    angular: {
      selector: "ui-breadcrumb-wrapper",
      exportName: "UiBreadcrumbComponent",
      projectedProp: "children",
      imports: ["UiBreadcrumbComponent"],
    },
    wc: { tagName: "ui-breadcrumb", textProp: "children" },
  },
  button: {
    react: { exportName: "UiButton", childrenProp: "label" },
    angular: {
      selector: "ui-button-angular",
      exportName: "ButtonComponent",
      projectedProp: "label",
      imports: ["ButtonComponent"],
    },
    wc: { tagName: "ui-button", textProp: "label" },
  },
  "button-group": {
    react: { exportName: "UiButtonGroup", childrenProp: "buttons" },
    angular: {
      selector: "ui-button-group-angular",
      exportName: "ButtonGroupComponent",
      projectedProp: "buttons",
      imports: ["ButtonGroupComponent", "ButtonComponent"],
    },
    wc: { tagName: "ui-button-group", textProp: "buttons" },
  },
  checkbox: {
    react: { exportName: "Checkbox" },
    angular: {
      selector: "ui-checkbox-angular",
      exportName: "UiCheckboxComponent",
      imports: ["UiCheckboxComponent"],
    },
    wc: { tagName: "ui-checkbox" },
  },
  "checkbox-dropdown": {
    react: { exportName: "CheckboxDropdown" },
    angular: {
      selector: "ui-checkbox-dropdown-angular",
      exportName: "UiCheckboxDropdownWrapper",
      imports: ["UiCheckboxDropdownWrapper"],
    },
    wc: { tagName: "ui-checkbox-dropdown" },
  },
  "date-picker": {
    react: { exportName: "DatePicker" },
    angular: {
      selector: "ui-date-picker-angular",
      exportName: "UiDatePickerComponent",
      imports: ["UiDatePickerComponent"],
    },
    wc: { tagName: "ui-date-picker" },
  },
  dropdown: {
    react: { exportName: "UiDropdown" },
    angular: {
      selector: "ui-dropdown-angular",
      exportName: "DropdownComponent",
      imports: ["DropdownComponent"],
    },
    wc: { tagName: "ui-dropdown" },
  },
  input: {
    react: { exportName: "UiInput" },
    angular: {
      selector: "ui-input-angular",
      exportName: "InputComponent",
      imports: ["InputComponent"],
    },
    wc: { tagName: "ui-input" },
  },
  panel: {
    react: { exportName: "Panel", childrenProp: "children" },
    angular: {
      selector: "ui-panel",
      exportName: "UiPanelComponent",
      projectedProp: "children",
      imports: [
        "UiPanelComponent",
        "UiPanelHeaderDirective",
        "UiPanelActionsDirective",
        "UiPanelFooterDirective",
      ],
    },
    wc: { tagName: "ui-panel", textProp: "children" },
  },
  radio: {
    react: { exportName: "Radio" },
    angular: {
      selector: "ui-radio-angular",
      exportName: "UiRadioComponent",
      imports: ["UiRadioComponent"],
    },
    wc: { tagName: "ui-radio" },
  },
  "radio-group": {
    react: { exportName: "RadioGroup", childrenProp: "radios" },
    angular: {
      selector: "ui-radio-group-angular",
      exportName: "UiRadioGroupComponent",
      projectedProp: "radios",
      imports: ["UiRadioGroupComponent", "UiRadioComponent"],
    },
    wc: { tagName: "ui-radio-group", textProp: "radios" },
  },
  spinner: {
    react: { exportName: "UiSpinner" },
    angular: {
      selector: "ui-spinner-angular",
      exportName: "SpinnerComponent",
      imports: ["SpinnerComponent"],
    },
    wc: { tagName: "ui-spinner" },
  },
  toast: {
    react: { exportName: "UiToast" },
    angular: {
      selector: "ui-toast-angular",
      exportName: "UiToastComponent",
      imports: ["UiToastComponent", "ToastTriggerDirective", "ButtonComponent"],
    },
    wc: { tagName: "ui-toast" },
  },
  toggle: {
    react: { exportName: "Toggle" },
    angular: {
      selector: "ui-toggle-angular",
      exportName: "UiToggleComponent",
      imports: ["UiToggleComponent"],
    },
    wc: { tagName: "ui-toggle" },
  },
  tooltip: {
    react: { exportName: "Tooltip" },
    angular: {
      selector: "ui-tooltip-angular",
      exportName: "UiTooltipComponent",
      imports: ["UiTooltipComponent"],
    },
    wc: { tagName: "ui-tooltip" },
  },
};

export function getComponentBinding(
  component: string,
  framework: Framework,
): ReactComponentBinding | AngularComponentBinding | WcComponentBinding | null {
  return componentRegistry[component]?.[framework] ?? null;
}
