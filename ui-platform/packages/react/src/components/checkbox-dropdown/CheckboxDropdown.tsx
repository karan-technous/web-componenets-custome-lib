import React, {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { useCheckboxDropdown } from './useCheckboxDropdown';

type Props = {
  label?: string;
  placeholder?: string;
  supportingText?: string;

  value?: string[];
  defaultValue?: string[];
  onChange?: (v: string[]) => void;

  options?: any[];                 // ✅ added
  showSelectAll?: boolean;         // ✅ added
  errorMessage?: string;           // ✅ added

  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  showAvatar?: boolean;
};

export const CheckboxDropdown = forwardRef<any, Props>(
  (
    {
      value,
      defaultValue,
      onChange,
      options,
      showSelectAll,
      errorMessage,
      ...rest
    },
    ref,
  ) => {
    const elRef = useRef<any>(null);

    const [val, setVal] = useCheckboxDropdown({
      value,
      defaultValue,
      onChange,
    });

    // Sync ALL props properly
    useEffect(() => {
      const el = elRef.current;
      if (!el) return;

      el.value = val;
      el.options = options;
      el.showSelectAll = showSelectAll;
      el.errorMessage = errorMessage;

      // Remove children from rest to avoid read-only property error
      const { children, ...safeRest } = rest as any;
      Object.assign(el, safeRest);
    }, [val, options, showSelectAll, errorMessage, rest]);

    // Event normalization
    useEffect(() => {
      const el = elRef.current;

      const handler = (e: any) => {
        setVal(e.detail);
      };

      el?.addEventListener('valueChange', handler);

      return () => {
        el?.removeEventListener('valueChange', handler);
      };
    }, [setVal]);

    useImperativeHandle(ref, () => ({
      focus: () => elRef.current?.focus(),
      get value() {
        return elRef.current?.value;
      },
    }));

    return <ui-checkbox-dropdown ref={elRef} />;
  },
);