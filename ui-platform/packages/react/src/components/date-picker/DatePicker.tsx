import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type DateRange = { start: Date; end: Date };
type DatePickerValue = Date | DateRange | undefined;
type DatePickerMode = "single" | "range";

type CustomParser = {
  regex: RegExp;
  parse: (match: RegExpMatchArray) => Date | DateRange;
};

export type DatePickerProps = {
  value?: DatePickerValue;
  defaultValue?: DatePickerValue;
  mode?: DatePickerMode;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  readonly?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  minDate?: Date;
  maxDate?: Date;
  minYear?: number;
  maxYear?: number;
  showIcon?: boolean;
  iconOnly?: boolean;
  icon?: string;
  label?: string;
  showActions?: boolean;
  search?: boolean;
  customParsers?: CustomParser[];
  debounce?: number;
  uiChange?: (date: Date | DateRange) => void;
  uiApply?: (date: Date | DateRange) => void;
  uiCancel?: () => void;
  uiInputChange?: (value: string) => void;
  uiOpenChange?: (open: boolean) => void;
  uiInvalidInput?: (value: string) => void;
  uiFocus?: () => void;
  uiBlur?: () => void;
};

export const DatePicker = forwardRef<HTMLElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      mode = "single",
      placeholder,
      disabled,
      loading,
      readonly,
      open,
      defaultOpen,
      minDate,
      maxDate,
      minYear,
      maxYear,
      showIcon = true,
      iconOnly = false,
      icon,
      label,
      showActions = false,
      search = false,
      customParsers,
      debounce = 220,
      uiChange,
      uiApply,
      uiCancel,
      uiInputChange,
      uiOpenChange,
      uiInvalidInput,
      uiFocus,
      uiBlur,
    },
    forwardedRef,
  ) => {
    const ref = useRef<any>(null);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<DatePickerValue>(defaultValue);
    const currentValue = isControlled ? value : internalValue;

    useImperativeHandle(forwardedRef, () => ref.current);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      el.value = currentValue;
      el.mode = mode;
      el.placeholder = placeholder ?? "Enter date (e.g. 1 Jan 2020)";
      el.disabled = !!disabled;
      el.loading = !!loading;
      el.readonly = !!readonly;
      el.open = open;
      el.defaultOpen = !!defaultOpen;
      el.minDate = minDate;
      el.maxDate = maxDate;
      el.minYear = minYear;
      el.maxYear = maxYear;
      el.showIcon = !!showIcon;
      el.iconOnly = !!iconOnly;
      el.icon = icon;
      el.label = label;
      el.showActions = !!showActions;
      el.search = !!search;
      el.customParsers = customParsers;
      el.debounce = debounce;
    }, [
      currentValue,
      mode,
      placeholder,
      disabled,
      loading,
      readonly,
      open,
      defaultOpen,
      minDate,
      maxDate,
      minYear,
      maxYear,
      showIcon,
      iconOnly,
      icon,
      label,
      showActions,
      search,
      customParsers,
      debounce,
    ]);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleChange = (e: any) => {
        const nextValue = e.detail as Date | DateRange;
        if (!isControlled) setInternalValue(nextValue);
        uiChange?.(nextValue);
      };
      const handleInputChange = (e: any) => uiInputChange?.(e.detail as string);
      const handleApply = (e: any) => uiApply?.(e.detail as Date | DateRange);
      const handleCancel = () => uiCancel?.();
      const handleOpenChange = (e: any) => uiOpenChange?.(!!e.detail);
      const handleInvalidInput = (e: any) => uiInvalidInput?.(e.detail as string);
      const handleFocus = () => uiFocus?.();
      const handleBlur = () => uiBlur?.();

      el.addEventListener("uiChange", handleChange);
      el.addEventListener("uiInputChange", handleInputChange);
      el.addEventListener("uiApply", handleApply);
      el.addEventListener("uiCancel", handleCancel);
      el.addEventListener("uiOpenChange", handleOpenChange);
      el.addEventListener("uiInvalidInput", handleInvalidInput);
      el.addEventListener("uiFocus", handleFocus);
      el.addEventListener("uiBlur", handleBlur);

      return () => {
        el.removeEventListener("uiChange", handleChange);
        el.removeEventListener("uiInputChange", handleInputChange);
        el.removeEventListener("uiApply", handleApply);
        el.removeEventListener("uiCancel", handleCancel);
        el.removeEventListener("uiOpenChange", handleOpenChange);
        el.removeEventListener("uiInvalidInput", handleInvalidInput);
        el.removeEventListener("uiFocus", handleFocus);
        el.removeEventListener("uiBlur", handleBlur);
      };
    }, [isControlled, uiApply, uiBlur, uiCancel, uiChange, uiFocus, uiInputChange, uiInvalidInput, uiOpenChange]);

    return React.createElement("ui-date-picker", { ref });
  },
);

DatePicker.displayName = "DatePicker";
