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
        variant?:
          | "default"
          | "secondary"
          | "outline"
          | "ghost"
          | "destructive"
          | "link";
        size?:
          | "default"
          | "xs"
          | "sm"
          | "lg"
          | "icon"
          | "icon-xs"
          | "icon-sm"
          | "icon-lg";
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

      "ui-checkbox-dropdown": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        label?: string;
        placeholder?: string;
        supportingText?: string;
        disabled?: boolean;
        required?: boolean;
        loading?: boolean;
        showAvatar?: boolean;
        ref: RefObject<any>;
      };

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

      "ui-dropdown": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: any;
        defaultValue?: any;
        options?: Array<{
          label: string;
          value: any;
          disabled?: boolean;
          group?: string;
        }>;
        mode?: "single" | "multiple";
        variant?: "input" | "button" | "icon-only";
        placeholder?: string;
        label?: string;
        disabled?: boolean;
        loading?: boolean;
        searchable?: boolean;
        clearable?: boolean;
        open?: boolean;
        selectAll?: boolean;
        minWidth?: string;
        maxHeight?: string;
      };

      "ui-tooltip": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      "ui-month-picker": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        disabled?: boolean;
        required?: boolean;
        errorMessage?: string;
        minYear?: number;
        maxYear?: number;
      };

      "ui-chip": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        label?: string;
        value?: string;
        active?: boolean;
        disabled?: boolean;
        iconName?: string;
        badgeCounter?: number;
        removable?: boolean;
      };

      "ui-spinner": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        variant?: "circular" | "dots" | "bars" | "pulse" | "ring";
        size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
        speed?: "slow" | "normal" | "fast" | number;
        color?: string;
        trackColor?: string;
        loading?: boolean;
        overlay?: boolean;
        inline?: boolean;
        center?: boolean;
        label?: string;
        subLabel?: string;
      };
    }
  }
}

export {};
