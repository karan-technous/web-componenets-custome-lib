/// <reference types="react" />

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ui-input": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
        placeholder?: string;
        disabled?: boolean;
      };

      "ui-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      "ui-toggle": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        checked?: boolean;
        disabled?: boolean;
      };

      "ui-checkbox": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        checked?: boolean;
        disabled?: boolean;
        size?: "sm" | "md" | "lg";
      };

      "ui-toast": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {};
