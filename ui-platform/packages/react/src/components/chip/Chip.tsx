import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { ChipEventDetail, IconName } from "@karan9186/core";

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

export interface ChipProps {
  label: string;
  value: string;
  active?: boolean;
  defaultActive?: boolean;
  disabled?: boolean;
  iconName?: IconName;
  badgeCounter?: number | string;
  removable?: boolean;
  size?: string;
  className?: string;
  onActiveChange?: (active: boolean, value: string) => void;
  onChipClick?: (value: ChipEventDetail) => void;
  onRemove?: (value: ChipEventDetail) => void;
  onIconClick?: (value: ChipEventDetail) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export interface ChipRef {
  readonly element: HTMLElement | null;
  focus: () => void;
  click: () => void;
}

export const Chip = forwardRef<ChipRef, ChipProps>(
  (
    {
      label,
      value,
      active,
      defaultActive = false,
      disabled = false,
      iconName,
      badgeCounter,
      removable = false,
      size = 'md',
      className,
      onActiveChange,
      onChipClick,
      onRemove,
      onIconClick,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLElement>(null);
    const isControlled = active !== undefined;
    const [activeState, setActiveState] = useControllableState<boolean>({
      value: active,
      defaultValue: defaultActive,
      onChange: (next) => onActiveChange?.(next, value),
    });

    useImperativeHandle(ref, () => ({
      get element() {
        return innerRef.current;
      },
      focus: () => innerRef.current?.focus(),
      click: () => innerRef.current?.click(),
    }), []);

    useEffect(() => {
      const el = innerRef.current as (HTMLElement & {
        label?: string;
        value?: string;
        active?: boolean;
        disabled?: boolean;
        iconName?: IconName;
        badgeCounter?: number | string;
        removable?: boolean;
        size?: string;
      }) | null;

      if (!el) {
        return;
      }

      el.label = label;
      el.value = value;
      el.active = activeState;
      el.disabled = disabled;
      el.iconName = iconName;
      el.badgeCounter = badgeCounter ? Number(badgeCounter) : undefined;
      el.removable = removable;
      el.size = size;
    }, [label, value, activeState, disabled, iconName, badgeCounter, removable, size]);

    useEffect(() => {
      const el = innerRef.current;

      if (!el) {
        return;
      }

      const handleChipClick = (event: Event) => {
        const detail = (event as CustomEvent<ChipEventDetail>).detail;
        const nextActive = !activeState;

        setActiveState(nextActive);

        if (isControlled && el) {
          (el as HTMLElement & { active?: boolean }).active = activeState;
        }

        onChipClick?.(detail);
      };

      const handleChipRemove = (event: Event) => {
        onRemove?.((event as CustomEvent<ChipEventDetail>).detail);
      };

      const handleChipIconClick = (event: Event) => {
        onIconClick?.((event as CustomEvent<ChipEventDetail>).detail);
      };

      el.addEventListener("chipClick", handleChipClick);
      el.addEventListener("chipRemove", handleChipRemove);
      el.addEventListener("chipIconClick", handleChipIconClick);

      return () => {
        el.removeEventListener("chipClick", handleChipClick);
        el.removeEventListener("chipRemove", handleChipRemove);
        el.removeEventListener("chipIconClick", handleChipIconClick);
      };
    }, [activeState, isControlled, onChipClick, onIconClick, onRemove, setActiveState]);

    return <ui-chip ref={innerRef} className={className} {...rest} />;
  },
);

Chip.displayName = "Chip";

export function useChip() {
  const ref = useRef<ChipRef>(null);

  return {
    ref,
    focus: () => ref.current?.focus(),
    click: () => ref.current?.click(),
  };
}
