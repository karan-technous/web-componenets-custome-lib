export default {
  title: "Button",
  component: "button",
};

export const Primary = {
  props: {
    variant: "primary",
    label: "Click Me",
    disabled: false,
  },
};

export const Secondary = {
  props: {
    variant: "secondary",
    label: "Cancel",
    disabled: false,
  },
};

export const Demo = {
  props: {
    variant: "primary",
    label: "hello",
    disabled: true,
  },
};
