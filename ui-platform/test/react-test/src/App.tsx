import { useState } from "react";
import { UiButton, UiInput } from "@ui-platform/react";

const App = () => {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleLoadingState = () => {
    setLoader(true);

    setTimeout(() => {
      setLoader(false);
    }, 2000);
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
      <UiButton onClick={() => setDisabled(!disabled)}>
        setDisabled or enabled toggle
      </UiButton>
      <br /> <br />
      <UiButton onClick={() => setValue("!disabled")}>
        set default value
      </UiButton>
      <br /> <br />
      <UiButton loading={loader} onClick={handleLoadingState}>
        Preview
      </UiButton>
    </div>
  );
};

export default App;
