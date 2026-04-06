export default {
  title: "Input",
  component: "input",
};

export const Default = {
  props: {
    placeholder: "Type your message",
    value: "",
    disabled: false,
  },
};

export const Filled = {
  props: {
    placeholder: "Search",
    value: "Design System",
    disabled: false,
  },
};

export const Disabled = {
  props: {
    placeholder: "Search",
    value: "Design System",
    disabled: true,
  },
};
