import { useState } from "react";
import { UiInput } from "@ui-platform/react";
import InputTest from "./test/input.test";

const App = () => {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  return (
    <div>
      <h2>Custom Input</h2>

      <UiInput
        value={value}
        placeholder="Enter your name"
        onChange={(val) => setValue(val)}
        disabled={disabled}
        onBlur={() => console.log("Blur event")}
      />

      <p>Value: {value}</p>
      <button onClick={() => setDisabled(!disabled)}>
        setDisabled or enabled toggle
      </button>
      <button onClick={() => setValue("!disabled")}>set default value</button>
      <InputTest />
    </div>
  );
};

export default App;
