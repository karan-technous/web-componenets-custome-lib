import { useState } from "react";
import { UiInput } from "@ui-platform/react";

const TOTAL = 500;

type InputItem = {
  value: string;
  placeholder: string;
  disabled: boolean;
};

export default function InputTest() {
  const [inputs, setInputs] = useState<InputItem[]>(
    Array.from({ length: TOTAL }, (_, i) => ({
      value: "",
      placeholder: `Input ${i}`,
      disabled: false,
    })),
  );

  //  Update single input
  const updateValue = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index].value = value;
    setInputs(newInputs);
  };

  //  Toggle one input
  const toggleOne = (index: number) => {
    const newInputs = [...inputs];
    newInputs[index].disabled = !newInputs[index].disabled;
    setInputs(newInputs);
  };

  //  Update ALL placeholders
  const updateAllPlaceholders = () => {
    setInputs((prev) =>
      prev.map((item, i) => ({
        ...item,
        placeholder: `Updated ${i}`,
      })),
    );
  };

  //  Set all values
  const fillAll = () => {
    setInputs((prev) =>
      prev.map((item, i) => ({
        ...item,
        value: `Value ${i}`,
      })),
    );
  };

  return (
    <div>
      <h2>React Advanced Stress Test</h2>

      <button onClick={updateAllPlaceholders}>Update All Placeholders</button>

      <button onClick={fillAll}>Fill All Values</button>

      <div style={{ height: "500px", overflow: "auto" }}>
        {inputs.map((item, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <UiInput
              value={item.value}
              placeholder={item.placeholder}
              disabled={item.disabled}
              onChange={(v) => updateValue(i, v)}
            />

            <button onClick={() => toggleOne(i)}>Toggle #{i}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
