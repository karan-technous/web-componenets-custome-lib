import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

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

export interface MonthPickerProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  minYear?: number;
  maxYear?: number;
  onChange?: (value: string) => void;
  [key: string]: any;
}

export interface MonthPickerRef {
  readonly element: HTMLElement | null;
  focus: () => void;
}

export const MonthPicker = forwardRef<MonthPickerRef, MonthPickerProps>(
  (
    {
      value,
      defaultValue = '',
      placeholder = 'Select month',
      disabled = false,
      required = false,
      errorMessage,
      minYear = 2000,
      maxYear = 2100,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLElement & { value?: string }>(null);

    const [state, setState] = useControllableState({
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
        focus: () => innerRef.current?.focus(),
      }),
      [],
    );

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.value = state;
      }
    }, [state]);

    useEffect(() => {
      const el = innerRef.current;

      if (!el) {
        return;
      }

      const handleValueChange = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        setState(detail);
      };

      el.addEventListener('valueChange', handleValueChange);

      return () => {
        el.removeEventListener('valueChange', handleValueChange);
      };
    }, [setState]);

    return (
      <ui-month-picker
        ref={innerRef}
        value={state}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        errorMessage={errorMessage}
        minYear={minYear}
        maxYear={maxYear}
        {...rest}
      />
    );
  },
);

MonthPicker.displayName = 'MonthPicker';
