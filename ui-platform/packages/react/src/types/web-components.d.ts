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
      > & {
        variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
        size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
        disabled?: boolean;
        loading?: boolean;
        fullWidth?: boolean;
        animated?: boolean;
        rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
        asChild?: boolean;
      };

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
