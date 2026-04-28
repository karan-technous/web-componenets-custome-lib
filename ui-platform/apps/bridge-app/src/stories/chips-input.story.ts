import type { StoryDefinition } from "../state/storyTypes";

const chipsInputStory: StoryDefinition = {
  id: "chips-input",
  title: "Chips Input",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "ChipsInput" },
    angular: { exportName: "UiChipsInputComponent" },
    wc: { tagName: "ui-chips-input" },
  },
  props: {
    placeholder: {
      type: "string",
      default: "Type and press Enter",
      description: "Placeholder shown when no chips are present",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disables typing and chip removal",
    },
    required: {
      type: "boolean",
      default: false,
      description: "Marks the field as required",
    },
    errorMessage: {
      type: "string",
      default: "",
      description: "Error text displayed below the field",
    },
    maxChips: {
      type: "string",
      default: "",
      description: "Optional maximum number of chips allowed",
    },
    separator: {
      type: "string",
      default: ",",
      description: "Keyboard separator used to create a chip",
    },
  },
  stories: {
    Default: {
      props: {
        placeholder: "Type and press Enter",
        separator: ",",
      },
    },
    Required: {
      props: {
        placeholder: "Add at least one recipient",
        required: true,
      },
    },
    Disabled: {
      props: {
        placeholder: "Recipients",
        disabled: true,
      },
    },
    "With Error": {
      props: {
        placeholder: "Add recipients",
        errorMessage: "Please add at least one recipient",
      },
    },
    "Max Chips": {
      props: {
        placeholder: "Add up to three tags",
        maxChips: "3",
      },
    },
    "Semicolon Separator": {
      props: {
        placeholder: "Type and press semicolon",
        separator: ";",
      },
    },
    Prefilled: {
      props: {
        placeholder: "Add recipients",
      },
      code: {
        react: `<ChipsInput value={["Design", "Frontend", "Accessibility"]} placeholder="Add recipients" />`,
        angular: `<ui-chips-input-angular [value]="['Design', 'Frontend', 'Accessibility']" [placeholder]="'Add recipients'"></ui-chips-input-angular>`,
        wc: `<ui-chips-input></ui-chips-input>

<script>
  const chipsInput = document.querySelector("ui-chips-input");
  if (chipsInput) {
    chipsInput.value = ["Design", "Frontend", "Accessibility"];
    chipsInput.placeholder = "Add recipients";
  }
</script>`,
      },
    },
  },
  docs: {
    description:
      "Chips Input turns free-form text into removable chips inside the input shell. It is designed for recipient entry, tag editing, and compact multi-value forms while reusing the design system's existing input and chip components.",
    examples: [
      {
        title: "Default",
        storyName: "Default",
        description: "Empty input ready for creating chips with Enter or comma.",
        props: {
          placeholder: "Type and press Enter",
          separator: ",",
        },
      },
      {
        title: "Required",
        storyName: "Required",
        description: "Field configured for form validation flows.",
        props: {
          placeholder: "Add at least one recipient",
          required: true,
        },
      },
      {
        title: "With Error",
        storyName: "With Error",
        description: "Shows supporting validation feedback below the input.",
        props: {
          placeholder: "Add recipients",
          errorMessage: "Please add at least one recipient",
        },
      },
      {
        title: "Prefilled",
        storyName: "Prefilled",
        description: "Starts with an existing set of chips, useful for edit forms.",
        props: {
          placeholder: "Add recipients",
        },
      },
    ],
    usage: {
      react: `import { ChipsInput } from "@karan9186/react";
import { useState } from "react";

export function Example() {
  const [value, setValue] = useState(["Design", "Frontend"]);

  return (
    <ChipsInput
      value={value}
      onChange={setValue}
      placeholder="Add tags"
      maxChips={5}
    />
  );
}`,
      angular: `import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { UiChipsInputComponent } from "@karan9186/angular";

@Component({
  standalone: true,
  selector: "app-chips-input-example",
  imports: [FormsModule, UiChipsInputComponent],
  template: \`
    <ui-chips-input-angular
      [(ngModel)]="tags"
      [placeholder]="'Add tags'"
      [maxChips]="5"
    ></ui-chips-input-angular>
  \`,
})
export class ChipsInputExampleComponent {
  tags = ["Design", "Frontend"];
}`,
      wc: `<ui-chips-input placeholder="Add tags"></ui-chips-input>

<script>
  const el = document.querySelector("ui-chips-input");
  el.value = ["Design", "Frontend"];
  el.addEventListener("valueChange", (event) => {
    console.log("Chips:", event.detail);
  });
</script>`,
    },
    api: [
      {
        name: "value",
        type: "string[]",
        defaultValue: "[]",
        description: "Current chip values rendered inside the input",
      },
      {
        name: "placeholder",
        type: "string",
        defaultValue: '"Type and press Enter"',
        description: "Placeholder shown when the component has no chips",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables typing, focusing, and chip removal",
      },
      {
        name: "required",
        type: "boolean",
        defaultValue: "false",
        description: "Marks the input as required for forms",
      },
      {
        name: "errorMessage",
        type: "string",
        defaultValue: "undefined",
        description: "Validation or helper message displayed below the field",
      },
      {
        name: "maxChips",
        type: "number",
        defaultValue: "undefined",
        description: "Optional upper limit for how many chips can be created",
      },
      {
        name: "separator",
        type: "string",
        defaultValue: '","',
        description: "Keyboard separator that also commits the current input as a chip",
      },
      {
        name: "valueChange",
        type: "(value: string[]) => void",
        defaultValue: "-",
        description: "Emitted whenever the chip collection changes",
      },
      {
        name: "chipAdd",
        type: "(value: string) => void",
        defaultValue: "-",
        description: "Emitted when a new chip is created",
      },
      {
        name: "chipRemove",
        type: "(value: string) => void",
        defaultValue: "-",
        description: "Emitted when a chip is removed",
      },
    ],
  },
};

export default chipsInputStory;
