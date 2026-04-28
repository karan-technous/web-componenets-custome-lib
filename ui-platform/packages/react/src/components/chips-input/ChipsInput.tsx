import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type UseControllableStateArgs<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
};

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateArgs<T>) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? value : internal;

  const setState = (next: T) => {
    if (!isControlled) {
      setInternal(next);
    }

    onChange?.(next);
  };

  return [state, setState] as const;
}

export interface ChipsInputProps {
  value?: string[];
  defaultValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  maxChips?: number;
  separator?: string;
  onChange?: (value: string[]) => void;
  onChipAdd?: (value: string) => void;
  onChipRemove?: (value: string) => void;
  onBlur?: () => void;
  [key: string]: any;
}

export interface ChipsInputRef {
  readonly element: HTMLElement | null;
  focus: () => void;
}

type UiChipsInputElement = HTMLElement & {
  value?: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  maxChips?: number;
  separator?: string;
  setFocus?: () => void;
};

export const ChipsInput = forwardRef<ChipsInputRef, ChipsInputProps>(
  (
    {
      value,
      defaultValue = [],
      placeholder = "Type and press Enter",
      disabled = false,
      required = false,
      errorMessage,
      maxChips,
      separator = ",",
      onChange,
      onChipAdd,
      onChipRemove,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<UiChipsInputElement>(null);

    const [state, setState] = useControllableState<string[]>({
      value,
      defaultValue,
      onChange,
    });

    useImperativeHandle(
      ref,
      () => ({
        get element() {
          return innerRef.current;
        },
        focus: () => innerRef.current?.setFocus?.(),
      }),
      [],
    );

    useEffect(() => {
      const el = innerRef.current;

      if (!el) {
        return;
      }

      el.value = state;
      el.placeholder = placeholder;
      el.disabled = disabled;
      el.required = required;
      el.errorMessage = errorMessage;
      el.maxChips = maxChips;
      el.separator = separator;

      Object.assign(el, rest);
    }, [state, placeholder, disabled, required, errorMessage, maxChips, separator, rest]);

    useEffect(() => {
      const el = innerRef.current;

      if (!el) {
        return;
      }

      const handleValueChange = (event: Event) => {
        setState((event as CustomEvent<string[]>).detail ?? []);
      };

      const handleChipAdd = (event: Event) => {
        onChipAdd?.((event as CustomEvent<string>).detail);
      };

      const handleChipRemove = (event: Event) => {
        onChipRemove?.((event as CustomEvent<string>).detail);
      };

      const handleBlur = () => {
        onBlur?.();
      };

      el.addEventListener("valueChange", handleValueChange);
      el.addEventListener("chipAdd", handleChipAdd);
      el.addEventListener("chipRemove", handleChipRemove);
      el.addEventListener("uiBlur", handleBlur);

      return () => {
        el.removeEventListener("valueChange", handleValueChange);
        el.removeEventListener("chipAdd", handleChipAdd);
        el.removeEventListener("chipRemove", handleChipRemove);
        el.removeEventListener("uiBlur", handleBlur);
      };
    }, [onBlur, onChipAdd, onChipRemove, setState]);

    return <ui-chips-input ref={innerRef} />;
  },
);

ChipsInput.displayName = "ChipsInput";

export function useChipsInput() {
  const ref = useRef<ChipsInputRef>(null);

  return {
    ref,
    focus: () => ref.current?.focus(),
  };
}
