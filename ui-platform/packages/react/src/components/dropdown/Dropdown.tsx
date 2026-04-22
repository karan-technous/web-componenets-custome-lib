import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";

export type DropdownOption = {
  label: string;
  value: any;
  disabled?: boolean;
  group?: string;
};

export type DropdownMode = 'single' | 'multiple';
export type DropdownVariant = 'input' | 'button' | 'icon-only';

type UiDropdownProps = {
  value?: any;
  defaultValue?: any;
  options: DropdownOption[];
  mode?: DropdownMode;
  variant?: DropdownVariant;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  open?: boolean;
  selectAll?: boolean;
  minWidth?: string;
  maxWidth?: string;
  maxHeight?: string;
  onChange?: (value: any) => void;
  onOpenChange?: (open: boolean) => void;
  onSearch?: (query: string) => void;
};

export const UiDropdown = forwardRef<HTMLElement, UiDropdownProps>(
  (
    {
      value,
      defaultValue = null,
      options = [],
      mode = 'single',
      variant = 'input',
      placeholder = 'Select...',
      label,
      disabled = false,
      loading = false,
      searchable = false,
      clearable = false,
      open = false,
      selectAll = false,
      minWidth = '200px',
      maxWidth = 'none',
      maxHeight = '300px',
      onChange,
      onOpenChange,
      onSearch,
    },
    forwardedRef,
  ) => {
    const ref = useRef<any>(null);

    // Controlled vs uncontrolled
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [internalOpen, setInternalOpen] = useState(open);

    const currentValue = isControlled ? value : internalValue;
    const currentOpen = isControlled ? open : internalOpen;

    // Stable refs
    const onChangeRef = useRef(onChange);
    const onOpenChangeRef = useRef(onOpenChange);
    const onSearchRef = useRef(onSearch);

    useEffect(() => {
      onChangeRef.current = onChange;
      onOpenChangeRef.current = onOpenChange;
      onSearchRef.current = onSearch;
    });

    // Sync props → Web Component
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      el.value = currentValue ?? null;
      el.defaultValue = defaultValue ?? null;
      el.options = options;
      el.mode = mode;
      el.variant = variant;
      el.placeholder = placeholder;
      el.label = label ?? '';
      el.disabled = disabled;
      el.loading = loading;
      el.searchable = searchable;
      el.clearable = clearable;
      el.open = currentOpen;
      el.selectAll = selectAll;
      el.minWidth = minWidth;
      el.maxWidth = maxWidth;
      el.maxHeight = maxHeight;
    }, [
      currentValue,
      defaultValue,
      options,
      mode,
      variant,
      placeholder,
      label,
      disabled,
      loading,
      searchable,
      clearable,
      currentOpen,
      selectAll,
      minWidth,
      maxWidth,
      maxHeight,
    ]);

    // Events
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleValueChange = (e: any) => {
        const val = e.detail;

        if (!isControlled) {
          setInternalValue(val);
        }

        onChangeRef.current?.(val);
      };

      const handleOpenChange = (e: any) => {
        const isOpen = e.detail;

        if (!isControlled) {
          setInternalOpen(isOpen);
        }

        onOpenChangeRef.current?.(isOpen);
      };

      const handleSearch = (e: any) => {
        const query = e.detail;
        onSearchRef.current?.(query);
      };

      el.addEventListener("valueChange", handleValueChange);
      el.addEventListener("openChange", handleOpenChange);
      el.addEventListener("search", handleSearch);

      return () => {
        el.removeEventListener("valueChange", handleValueChange);
        el.removeEventListener("openChange", handleOpenChange);
        el.removeEventListener("search", handleSearch);
      };
    }, [isControlled]);

    useImperativeHandle(forwardedRef, () => ref.current);

    return <ui-dropdown ref={ref}></ui-dropdown>;
  },
);

UiDropdown.displayName = "UiDropdown";
