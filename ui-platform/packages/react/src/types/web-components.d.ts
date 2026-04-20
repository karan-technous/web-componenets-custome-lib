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

      "ui-button-group": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      "ui-date-picker": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: Date | { start: Date; end: Date };
        defaultValue?: Date | { start: Date; end: Date };
        mode?: "single" | "range";
        placeholder?: string;
        disabled?: boolean;
        loading?: boolean;
        readonly?: boolean;
        open?: boolean;
        defaultOpen?: boolean;
        minDate?: Date;
        maxDate?: Date;
        showIcon?: boolean;
        iconOnly?: boolean;
        showActions?: boolean;
        search?: boolean;
        icon?: string | HTMLElement;
        customParsers?: Array<{
          regex: RegExp;
          parse: (match: RegExpMatchArray) => Date | { start: Date; end: Date };
        }>;
      };
    }
  }
}

export {};
