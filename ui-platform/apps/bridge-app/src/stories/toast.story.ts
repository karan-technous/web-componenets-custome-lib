import type { StoryDefinition } from "../state/storyTypes";

const toastStory: StoryDefinition = {
  id: "toast",
  title: "Toast",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "UiToast" },
    angular: { exportName: "UiToastComponent" },
    wc: { tagName: "ui-toast" },
  },
  props: {
    message: {
      type: "string",
      default: "Toast message",
      description: "Text content of the toast",
    },
    type: {
      type: "select",
      options: ["success", "error", "warning", "info", "promise"],
      default: "info",
      description: "Toast type that determines icon and color",
    },
    position: {
      type: "select",
      options: ["top-left", "top-right", "bottom-left", "bottom-right", "center"],
      default: "top-right",
      description: "Position where toast appears",
    },
    loading: {
      type: "string",
      default: "Loading...",
      description: "Loading message for promise toast",
    },
    success: {
      type: "string",
      default: "Success!",
      description: "Success message for promise toast",
    },
    error: {
      type: "string",
      default: "Error!",
      description: "Error message for promise toast",
    },
    duration: {
      type: "string",
      default: "4000",
      description: "Duration in milliseconds for toast display",
    },
  },
  stories: {
    Success: {
      props: {
        message: "Operation completed successfully!",
        type: "success",
      },
    },
    Error: {
      props: {
        message: "Something went wrong. Please try again.",
        type: "error",
      },
    },
    Warning: {
      props: {
        message: "Your session will expire in 5 minutes.",
        type: "warning",
      },
    },
    Info: {
      props: {
        message: "New updates are available.",
        type: "info",
      },
    },
    Promise: {
      props: {
        message: "Processing your request...",
        type: "promise",
      },
    },
  },
  docs: {
    description:
      "Toasts are brief notifications that appear temporarily to inform users about system events, successes, errors, or important updates.",
    examples: [
      {
        title: "Success",
        props: { message: "Operation completed successfully!", type: "success" },
      },
      {
        title: "Error",
        props: { message: "Something went wrong.", type: "error" },
      },
      {
        title: "Warning",
        props: { message: "Session expiring soon.", type: "warning" },
      },
    ],
    usage: {
      react: `import { useToast } from "@karan9186/react";

const toast = useToast();
toast.show({ message: "Success!", type: "success" });`,
      angular: `import { ToastService } from "@karan9186/ui-lib";

constructor(private toast: ToastService) {}
this.toast.show({ message: "Success!", type: "success" });`,
      wc: `const toast = document.querySelector('ui-toast');
toast.show({ message: "Success!", type: "success" });`,
    },
  },
};

export default toastStory;
