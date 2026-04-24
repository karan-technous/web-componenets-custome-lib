import { useState } from "react";
import { Radio, RadioGroup, useRadioGroup } from "@karan9186/react";

export function RadioTest() {
  const [controlledValue, setControlledValue] = useState("option1");
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("vertical");

  // Uncontrolled example
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const { value: hookValue, setValue: setHookValue, isChecked } = useRadioGroup({
    defaultValue: "option1",
    onChange: (val) => console.log("Hook value changed:", val),
  });

  return (
    <section style={{ marginTop: 24, padding: 20 }}>
      <h2>Radio Button Test Suite</h2>

      <div style={{ display: "grid", gap: 32 }}>
        {/* 1. Default - Basic Radio Group */}
        <div>
          <h3>1. Default - Basic Radio Group</h3>
          <RadioGroup
            name="default-group"
            value={controlledValue}
            onChange={setControlledValue}
          >
            <Radio value="option1">Option 1</Radio>
            <Radio value="option2">Option 2</Radio>
            <Radio value="option3">Option 3</Radio>
          </RadioGroup>
          <p>Selected: {controlledValue}</p>
        </div>

        {/* 2. States */}
        <div>
          <h3>2. States</h3>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <h4>Checked</h4>
              <Radio value="checked" checked>
                Checked radio
              </Radio>
            </div>
            <div>
              <h4>Unchecked</h4>
              <Radio value="unchecked">
                Unchecked radio
              </Radio>
            </div>
            <div>
              <h4>Disabled</h4>
              <Radio value="disabled" disabled>
                Disabled radio
              </Radio>
              <Radio value="disabled-checked" checked disabled>
                Disabled checked radio
              </Radio>
            </div>
            <div>
              <h4>Error</h4>
              <Radio value="error" error>
                Error state radio
              </Radio>
            </div>
          </div>
        </div>

        {/* 3. With Supporting Text */}
        <div>
          <h3>3. With Supporting Text</h3>
          <RadioGroup name="supporting-group" defaultValue="option-a">
            <Radio
              value="option-a"
              label="Option A"
              supportingText="This is the first option with description"
            />
            <Radio
              value="option-b"
              label="Option B"
              supportingText="This is the second option with more details"
            />
            <Radio
              value="option-c"
              label="Option C"
              supportingText="This is the third option explaining the choice"
            />
          </RadioGroup>
        </div>

        {/* 4. Group Selection */}
        <div>
          <h3>4. Group Selection</h3>
          <RadioGroup
            name="group-selection"
            value={controlledValue}
            onChange={setControlledValue}
          >
            <Radio value="red">Red</Radio>
            <Radio value="green">Green</Radio>
            <Radio value="blue">Blue</Radio>
            <Radio value="yellow">Yellow</Radio>
          </RadioGroup>
          <p>Selected color: {controlledValue}</p>
        </div>

        {/* 5. Controlled vs Uncontrolled */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <h3>5a. Controlled (React)</h3>
            <RadioGroup
              name="controlled-group"
              value={controlledValue}
              onChange={setControlledValue}
              disabled={disabled}
            >
              <Radio value="ctrl-1">Controlled Option 1</Radio>
              <Radio value="ctrl-2">Controlled Option 2</Radio>
              <Radio value="ctrl-3">Controlled Option 3</Radio>
            </RadioGroup>
            <p>Value: {controlledValue}</p>
            <button onClick={() => setControlledValue("ctrl-1")}>Set to Option 1</button>
            <button onClick={() => setControlledValue("ctrl-2")}>Set to Option 2</button>
            <button onClick={() => setDisabled(!disabled)}>
              {disabled ? "Enable" : "Disable"}
            </button>
          </div>

          <div>
            <h3>5b. Uncontrolled (React)</h3>
            <RadioGroup
              name="uncontrolled-group"
              defaultValue="unctrl-1"
              onChange={setUncontrolledValue}
            >
              <Radio value="unctrl-1">Uncontrolled Option 1</Radio>
              <Radio value="unctrl-2">Uncontrolled Option 2</Radio>
              <Radio value="unctrl-3">Uncontrolled Option 3</Radio>
            </RadioGroup>
            <p>Last selected: {uncontrolledValue}</p>
          </div>
        </div>

        {/* 6. Hook Usage */}
        <div>
          <h3>6. useRadioGroup Hook</h3>
          <RadioGroup name="hook-group" value={hookValue} onChange={setHookValue}>
            <Radio value="hook-1">Hook Option 1</Radio>
            <Radio value="hook-2">Hook Option 2</Radio>
            <Radio value="hook-3">Hook Option 3</Radio>
          </RadioGroup>
          <p>Hook value: {hookValue}</p>
          <p>Is hook-1 checked: {String(isChecked("hook-1"))}</p>
          <p>Is hook-2 checked: {String(isChecked("hook-2"))}</p>
          <button onClick={() => setHookValue("hook-1")}>Set hook-1 via hook</button>
          <button onClick={() => setHookValue("hook-2")}>Set hook-2 via hook</button>
        </div>

        {/* 7. Interactive Playground */}
        <div>
          <h3>7. Interactive Playground</h3>
          <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
            <label>
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
              />
              Disabled
            </label>
            <label>
              <input
                type="checkbox"
                checked={error}
                onChange={(e) => setError(e.target.checked)}
              />
              Error State
            </label>
            <label>
              Orientation:
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as "horizontal" | "vertical")}
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </label>
          </div>
          <RadioGroup
            name="playground-group"
            value={controlledValue}
            onChange={setControlledValue}
            disabled={disabled}
            orientation={orientation}
            label="Choose your preference"
          >
            <Radio
              value="play-1"
              label="Preference 1"
              supportingText="Description for preference 1"
              error={error}
            />
            <Radio
              value="play-2"
              label="Preference 2"
              supportingText="Description for preference 2"
              error={error}
            />
            <Radio
              value="play-3"
              label="Preference 3"
              supportingText="Description for preference 3"
              error={error}
            />
          </RadioGroup>
          <p>Selected: {controlledValue}</p>
        </div>

        {/* 8. Animation Showcase */}
        <div>
          <h3>8. Animation Showcase</h3>
          <p>Interact with the radios to see smooth transitions:</p>
          <RadioGroup name="animation-group" defaultValue="anim-1">
            <Radio value="anim-1" label="Hover me" supportingText="See the hover effect" />
            <Radio value="anim-2" label="Focus me" supportingText="Tab to see focus ring" />
            <Radio value="anim-3" label="Click me" supportingText="Watch the dot animate" />
          </RadioGroup>
          <p style={{ fontSize: 12, color: "#666" }}>
            Features: Smooth dot scale animation, focus ring pulse, hover state transitions
          </p>
        </div>

        {/* Required Field Example */}
        <div>
          <h3>Required Field Example</h3>
          <RadioGroup name="required-group" required label="Payment Method (Required)">
            <Radio value="credit-card">Credit Card</Radio>
            <Radio value="paypal">PayPal</Radio>
            <Radio value="bank-transfer">Bank Transfer</Radio>
          </RadioGroup>
        </div>

        {/* Horizontal Layout */}
        <div>
          <h3>Horizontal Layout</h3>
          <RadioGroup
            name="horizontal-group"
            orientation="horizontal"
            defaultValue="h-1"
          >
            <Radio value="h-1">Small</Radio>
            <Radio value="h-2">Medium</Radio>
            <Radio value="h-3">Large</Radio>
          </RadioGroup>
        </div>
      </div>
    </section>
  );
}
