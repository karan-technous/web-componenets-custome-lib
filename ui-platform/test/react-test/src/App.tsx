import { useState } from "react";
import {
  UiButton,
  UiCheckbox,
  UiInput,
  Toggle,
  useToast,
} from "@karan9186/react";
import { ToggleTest } from "./test/toggle.test";
import { CheckboxTest } from "./test/checkbox.test";

const App = () => {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loader, setLoader] = useState(false);
  const toast = useToast();
  const handleLoadingState = () => {
    setLoader(true);

    setTimeout(() => {
      setLoader(false);
    }, 2000);
  };

  // Mock API call for promise toast example
  const mockApiCall = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate
        console.log("Mock API call result:", success);
        if (success) {
          resolve({ data: "Operation completed successfully" });
        } else {
          reject(new Error("Operation failed"));
        }
      }, 3000);
    });
  };

  const handlePromiseToast = () => {
    toast.promise(mockApiCall(), {
      loading: "Saving data...",
      success: "Data saved successfully!",
      error: "Failed to save data",
      position: "bottom-right",
      duration: 4000,
    });
  };
  return (
    <div>
      <h2>Custom Input</h2>
      <UiInput
        value={value}
        // placeholder="Enter your name"
        onChange={(val) => setValue(val)}
        disabled={disabled}
        onBlur={() => console.log("Blur event")}
      />
      <p>Value: {value}</p>
      <UiButton
        onClick={() => {
          setDisabled(!disabled);
          toast.show({
            message: "Hello Toast 🚀",
            type: "success",
            position: "top-right",
            duration: 3000,
            closable:false,
            slot: "test",
            dedupe: true,
          });
        }}
      >
        setDisabled or enabled toggle
      </UiButton>
      <br /> <br />
      <UiButton onClick={() => setValue("!disabled")}>
        set default value
      </UiButton>
      <br /> <br />
      <h2>Promise Toast Example</h2>
      <UiButton onClick={handlePromiseToast}>
        Test Promise Toast (70% success rate)
      </UiButton>
      <br /> <br />
      <h1>sdfhsdfhksdhfksdhfksdhfkhsdfhsdhfi---------------------</h1>
      <UiButton loading={loader} onClick={handleLoadingState}>
        Preview
      </UiButton>
      <br /> <br />
      <h1>checking checkbox</h1>
      <UiCheckbox
        defaultChecked
        onChange={(checked) => console.log("App checkbox:", checked)}
      >
        Quick checkbox smoke test
      </UiCheckbox>
      <Toggle />
      <h1>testing start here</h1>
      <ToggleTest />
      <CheckboxTest />
    </div>
  );
};

export default App;
