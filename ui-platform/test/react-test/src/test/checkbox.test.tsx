import { useState } from "react";
import { UiCheckbox } from "@karan9186/react";

export function CheckboxTest() {
  const [controlled, setControlled] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(false);

  return (
    <section style={{ marginTop: 24 }}>
      <h2>Checkbox Test</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <h3>Controlled</h3>
          <UiCheckbox
            checked={controlled}
            disabled={disabled}
            onChange={setControlled}
            onBlur={() => console.log("controlled blur")}
          >
            Accept terms (controlled)
          </UiCheckbox>
          <p>Value: {String(controlled)}</p>
          <button onClick={() => setControlled((prev) => !prev)}>
            Toggle From Parent
          </button>
          <button onClick={() => setDisabled((prev) => !prev)}>
            {disabled ? "Enable" : "Disable"}
          </button>
        </div>

        <div>
          <h3>Uncontrolled</h3>
          <UiCheckbox
            defaultChecked={false}
            size="lg"
            onChange={setUncontrolledValue}
          >
            Newsletter (uncontrolled)
          </UiCheckbox>
          <p>Value: {String(uncontrolledValue)}</p>
        </div>

        <div>
          <h3>Disabled</h3>
          <UiCheckbox checked disabled>
            Disabled checkbox
          </UiCheckbox>
        </div>
      </div>
    </section>
  );
}
