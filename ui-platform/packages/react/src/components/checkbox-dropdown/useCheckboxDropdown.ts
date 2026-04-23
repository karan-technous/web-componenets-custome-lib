import { useState, useCallback } from 'react';

export function useCheckboxDropdown({
  value,
  defaultValue = [],
  onChange,
}: {
  value?: string[];
  defaultValue?: string[];
  onChange?: (v: string[]) => void;
}) {
  const [internal, setInternal] = useState(defaultValue);

  const isControlled = value !== undefined;

  const current = isControlled ? value : internal;

  const setValue = useCallback(
    (v: string[]) => {
      if (!isControlled) setInternal(v);
      onChange?.(v);
    },
    [isControlled, onChange],
  );

  return [current, setValue] as const;
}