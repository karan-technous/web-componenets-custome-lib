import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type UiCheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  children?: React.ReactNode;
};

export const UiCheckbox = forwardRef<HTMLElement, UiCheckboxProps>(
  (
    {
      checked,
      defaultChecked = false,
      disabled = false,
      size = 'md',
      onChange,
      onBlur,
      children,
    },
    forwardedRef,
  ) => {
    const ref = useRef<any>(null);
    const controlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const onChangeRef = useRef(onChange);
    const onBlurRef = useRef(onBlur);

    useEffect(() => {
      onChangeRef.current = onChange;
      onBlurRef.current = onBlur;
    }, [onChange, onBlur]);

    const currentValue = controlled ? checked : internalChecked;

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      el.checked = !!currentValue;
      el.disabled = !!disabled;
      el.size = size;
    }, [currentValue, disabled, size]);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleChange = (event: any) => {
        const nextChecked = !!event.detail;

        if (!controlled) {
          setInternalChecked(nextChecked);
        }

        onChangeRef.current?.(nextChecked);
      };

      const handleBlur = () => {
        onBlurRef.current?.();
      };

      el.addEventListener('checkboxChange', handleChange);
      el.addEventListener('uiBlur', handleBlur);

      return () => {
        el.removeEventListener('checkboxChange', handleChange);
        el.removeEventListener('uiBlur', handleBlur);
      };
    }, [controlled]);

    useImperativeHandle(forwardedRef, () => ref.current as HTMLElement, []);

    return <ui-checkbox ref={ref}>{children}</ui-checkbox>;
  },
);

UiCheckbox.displayName = 'UiCheckbox';
