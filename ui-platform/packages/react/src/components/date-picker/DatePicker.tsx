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
  showIcon?: boolean;
  iconOnly?: boolean;
  icon?: string;
  showActions?: boolean;
  search?: boolean;
  customParsers?: CustomParser[];
  debounce?: number;
  onChange?: (date: Date | DateRange) => void;
  onApply?: (date: Date | DateRange) => void;
  onCancel?: () => void;
  onInputChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onInvalidInput?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
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
      showIcon = true,
      iconOnly = false,
      icon,
      showActions = false,
      search = false,
      customParsers,
      debounce = 220,
      onChange,
      onApply,
      onCancel,
      onInputChange,
      onOpenChange,
      onInvalidInput,
      onFocus,
      onBlur,
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
      el.showIcon = !!showIcon;
      el.iconOnly = !!iconOnly;
      el.icon = icon;
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
      showIcon,
      iconOnly,
      icon,
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
        onChange?.(nextValue);
      };
      const handleInputChange = (e: any) => onInputChange?.(e.detail as string);
      const handleApply = (e: any) => onApply?.(e.detail as Date | DateRange);
      const handleCancel = () => onCancel?.();
      const handleOpenChange = (e: any) => onOpenChange?.(!!e.detail);
      const handleInvalidInput = (e: any) => onInvalidInput?.(e.detail as string);
      const handleFocus = () => onFocus?.();
      const handleBlur = () => onBlur?.();

      el.addEventListener("onChange", handleChange);
      el.addEventListener("onInputChange", handleInputChange);
      el.addEventListener("onApply", handleApply);
      el.addEventListener("onCancel", handleCancel);
      el.addEventListener("onOpenChange", handleOpenChange);
      el.addEventListener("onInvalidInput", handleInvalidInput);
      el.addEventListener("onFocus", handleFocus);
      el.addEventListener("onBlur", handleBlur);

      return () => {
        el.removeEventListener("onChange", handleChange);
        el.removeEventListener("onInputChange", handleInputChange);
        el.removeEventListener("onApply", handleApply);
        el.removeEventListener("onCancel", handleCancel);
        el.removeEventListener("onOpenChange", handleOpenChange);
        el.removeEventListener("onInvalidInput", handleInvalidInput);
        el.removeEventListener("onFocus", handleFocus);
        el.removeEventListener("onBlur", handleBlur);
      };
    }, [isControlled, onApply, onBlur, onCancel, onChange, onFocus, onInputChange, onInvalidInput, onOpenChange]);

    return React.createElement("ui-date-picker", { ref });
  },
);

DatePicker.displayName = "DatePicker";
