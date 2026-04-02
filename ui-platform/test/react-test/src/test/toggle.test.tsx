import { useState } from "react";
import { Toggle } from "@karan9186/react";

export const ToggleTest = () => {
  // Controlled state
  const [controlledValue, setControlledValue] = useState(true);

  // Uncontrolled state (just for display)
  const [uncontrolledValue, setUncontrolledValue] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      <h2>🔥 Toggle Component Full React Test</h2>

      {/* ✅ 1. Uncontrolled */}
      <section>
        <h3>Uncontrolled Toggle</h3>
        <Toggle
          defaultChecked={true}
          disabled
          onChange={(val) => {
            console.log("Uncontrolled Changed:", val);
            setUncontrolledValue(val);
          }}
        />
        <p>Value: {String(uncontrolledValue)}</p>
      </section>

      <hr />

      {/* ✅ 2. Controlled */}
      <section>
        <h3>Controlled Toggle</h3>
        <Toggle
          checked={controlledValue}
          size="sm"
          onChange={(val) => {
            console.log("Controlled Changed:", val);
            setControlledValue(val);
          }}
        />
        <p>Value: {String(controlledValue)}</p>

        <button onClick={() => setControlledValue((v) => !v)}>
          Toggle from Parent
        </button>
      </section>

      <hr />

      {/* ✅ 3. Disabled */}
      <section>
        <h3>Disabled Toggle</h3>
        <Toggle
          disabled={true}
          onChange={() => {
            console.log("Should NOT fire");
          }}
        />
      </section>

      <hr />

      {/* ✅ 4. Prop Sync Test */}
      <section>
        <h3>External Control Sync</h3>
        <Toggle checked={controlledValue} onChange={setControlledValue} />
        <button onClick={() => setControlledValue(true)}>Set TRUE</button>
        <button onClick={() => setControlledValue(false)}>Set FALSE</button>
      </section>
    </div>
  );
};
