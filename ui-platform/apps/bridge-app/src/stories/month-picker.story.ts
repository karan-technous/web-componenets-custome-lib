import type { StoryDefinition } from "../state/storyTypes";

const monthPickerStory: StoryDefinition = {
  id: "month-picker",
  title: "Month Picker",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "MonthPicker" },
    angular: { exportName: "UiMonthPickerComponent" },
    wc: { tagName: "ui-month-picker" },
  },
  props: {
    value: {
      type: "string",
      default: "",
      description: "Selected month and year (format: 'Apr 2026')",
    },
    placeholder: {
      type: "string",
      default: "Select month",
      description: "Placeholder text shown when no value is selected",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disables the month picker and prevents interaction",
    },
    required: {
      type: "boolean",
      default: false,
      description: "Marks the field as required",
    },
    errorMessage: {
      type: "string",
      default: "",
      description: "Error message to display below the input",
    },
    minYear: {
      type: "string",
      default: "2000",
      description: "Minimum year available in the year selector",
    },
    maxYear: {
      type: "string",
      default: "2100",
      description: "Maximum year available in the year selector",
    },
  },
  stories: {
    Default: {
      props: {
        placeholder: "Select month",
      },
    },
    WithValue: {
      props: {
        value: "Apr 2026",
        placeholder: "Select month",
      },
    },
    Disabled: {
      props: {
        disabled: true,
        placeholder: "Select month",
      },
    },
    DisabledWithValue: {
      props: {
        value: "Dec 2025",
        disabled: true,
        placeholder: "Select month",
      },
    },
    Required: {
      props: {
        required: true,
        placeholder: "Select month (required)",
      },
    },
    WithError: {
      props: {
        errorMessage: "Please select a valid month",
        placeholder: "Select month",
      },
    },
    CustomYearRange: {
      props: {
        minYear: "2020",
        maxYear: "2030",
        placeholder: "Select month",
      },
    },
    PastYears: {
      props: {
        minYear: "1990",
        maxYear: "2020",
        placeholder: "Select past month",
      },
    },
    FutureYears: {
      props: {
        minYear: "2026",
        maxYear: "2050",
        placeholder: "Select future month",
      },
    },
    Complete: {
      props: {
        value: "Mar 2026",
        placeholder: "Select month",
        required: true,
        minYear: "2000",
        maxYear: "2100",
      },
    },
  },
  docs: {
    description:
      "Month Picker component provides an intuitive interface for selecting a specific month and year. It features a dropdown panel with scrollable month list and year selector.\n\nThis component supports:\n- Month and year selection\n- Custom year ranges\n- Disabled state\n- Error handling\n- Accessibility (ARIA labels and keyboard navigation)\n- Theme-driven styling\n- Works across React, Angular v21+, and Web Components\n\nUse cases:\n- Date range filters\n- Report period selection\n- Budget planning interfaces\n- Calendar-based UI patterns",
    examples: [
      {
        title: "Default",
        storyName: "Default",
        description: "Basic month picker with default placeholder.",
        props: { placeholder: "Select month" },
      },
      {
        title: "With Selected Value",
        storyName: "WithValue",
        description: "Month picker with a pre-selected value.",
        props: { value: "Apr 2026", placeholder: "Select month" },
      },
      {
        title: "Disabled State",
        storyName: "Disabled",
        description: "Disabled month picker that cannot be interacted with.",
        props: { disabled: true, placeholder: "Select month" },
      },
      {
        title: "Required Field",
        storyName: "Required",
        description: "Month picker marked as required.",
        props: { required: true, placeholder: "Select month (required)" },
      },
      {
        title: "With Error Message",
        storyName: "WithError",
        description: "Month picker displaying validation error.",
        props: { errorMessage: "Please select a valid month", placeholder: "Select month" },
      },
      {
        title: "Custom Year Range",
        storyName: "CustomYearRange",
        description: "Month picker with a limited year range (2020-2030).",
        props: { minYear: "2020", maxYear: "2030", placeholder: "Select month" },
      },
      {
        title: "Historical Months",
        storyName: "PastYears",
        description: "Month picker for selecting historical data (1990-2020).",
        props: { minYear: "1990", maxYear: "2020", placeholder: "Select past month" },
      },
      {
        title: "Future Planning",
        storyName: "FutureYears",
        description: "Month picker for future date selection (2026-2050).",
        props: { minYear: "2026", maxYear: "2050", placeholder: "Select future month" },
      },
    ],
    usage: {
      react: `import { MonthPicker } from "@karan9186/react";
import { useState } from "react";

export function MonthPickerExample() {
  const [selectedMonth, setSelectedMonth] = useState("");

  return (
    <div>
      <MonthPicker
        value={selectedMonth}
        onChange={(value) => setSelectedMonth(value)}
        placeholder="Select month"
        minYear={2000}
        maxYear={2100}
      />
      {selectedMonth && <p>Selected: {selectedMonth}</p>}
    </div>
  );
}`,
      angular: `import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { UiMonthPickerComponent } from "@karan9186/angular";

@Component({
  selector: "app-month-picker-example",
  template: \`
    <ui-month-picker-angular
      [(ngModel)]="selectedMonth"
      placeholder="Select month"
      [minYear]="2000"
      [maxYear]="2100"
    ></ui-month-picker-angular>
    <p *ngIf="selectedMonth">Selected: {{ selectedMonth }}</p>
  \`,
  standalone: true,
  imports: [UiMonthPickerComponent, FormsModule],
})
export class MonthPickerExampleComponent {
  selectedMonth = "";
}`,
      wc: `<!-- Basic usage -->
<ui-month-picker
  placeholder="Select month"
  min-year="2000"
  max-year="2100"
></ui-month-picker>

<!-- With value -->
<ui-month-picker
  value="Apr 2026"
  placeholder="Select month"
></ui-month-picker>

<!-- Disabled -->
<ui-month-picker
  placeholder="Select month"
  disabled
></ui-month-picker>

<!-- With error -->
<ui-month-picker
  placeholder="Select month"
  error-message="Please select a valid month"
></ui-month-picker>

<!-- Listen for changes -->
<script>
  const picker = document.querySelector("ui-month-picker");
  picker.addEventListener("valueChange", (e) => {
    console.log("Selected month:", e.detail);
  });
</script>`,
    },
    api: [
      {
        name: "value",
        type: "string",
        defaultValue: '""',
        description: "Selected month and year in format 'Mon YYYY' (e.g. 'Apr 2026')",
        required: false,
      },
      {
        name: "placeholder",
        type: "string",
        defaultValue: '"Select month"',
        description: "Placeholder text displayed when no value is selected",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables the month picker and prevents user interaction",
        required: false,
      },
      {
        name: "errorMessage",
        type: "string",
        defaultValue: "undefined",
        description: "Error message displayed below the input field",
        required: false,
      },
      {
        name: "minYear",
        type: "number",
        defaultValue: "2000",
        description: "Minimum year available in the year dropdown selector",
        required: false,
      },
      {
        name: "maxYear",
        type: "number",
        defaultValue: "2100",
        description: "Maximum year available in the year dropdown selector",
        required: false,
      },
      {
        name: "valueChange",
        type: "(value: string) => void",
        defaultValue: "-",
        description: "Emitted when a month is selected (returns 'Mon YYYY' format)",
        required: false,
      },
    ],
  },
};

export default monthPickerStory;
