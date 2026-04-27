import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  TooltipPosition,
  TooltipTrigger,
  TooltipVariant,
} from "@karan9186/core";

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

export interface TooltipProps {
  children: ReactNode;
  content?: string;
  tooltipContent?: ReactNode;
  position?: TooltipPosition;
  trigger?: TooltipTrigger;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  variant?: TooltipVariant;
  delay?: number;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export interface TooltipRef {
  readonly element: HTMLElement | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const Tooltip = forwardRef<TooltipRef, TooltipProps>(
  (
    {
      children,
      content,
      tooltipContent,
      position = "top",
      trigger = "hover",
      open,
      defaultOpen = false,
      disabled = false,
      variant = tooltipContent ? "complex" : "simple",
      delay = 150,
      onOpenChange,
      className,
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLElement>(null);
    const [state, setState] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    useImperativeHandle(ref, () => ({
      get element() {
        return innerRef.current;
      },
      open: () => setState(true),
      close: () => setState(false),
      toggle: () => setState(!state),
    }), [setState, state]);

    useEffect(() => {
      const el = innerRef.current as (HTMLElement & {
        content?: string;
        position?: TooltipPosition;
        trigger?: TooltipTrigger;
        open?: boolean;
        disabled?: boolean;
        variant?: TooltipVariant;
        delay?: number;
      }) | null;

      if (!el) {
        return;
      }

      el.content = content;
      el.position = position;
      el.trigger = trigger;
      el.open = state;
      el.disabled = disabled;
      el.variant = variant;
      el.delay = delay;
    }, [content, position, trigger, state, disabled, variant, delay]);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) {
        return;
      }

      const handleOpenChange = (event: Event) => {
        setState(!!(event as CustomEvent<boolean>).detail);
      };

      el.addEventListener("openChange", handleOpenChange);
      return () => el.removeEventListener("openChange", handleOpenChange);
    }, [setState]);

    return (
      <ui-tooltip ref={innerRef} className={className}>
        {children}
        {tooltipContent ? <div slot="content">{tooltipContent}</div> : null}
      </ui-tooltip>
    );
  },
);

Tooltip.displayName = "Tooltip";

export function useTooltip() {
  const ref = useRef<TooltipRef>(null);

  return {
    ref,
    open: () => ref.current?.open(),
    close: () => ref.current?.close(),
    toggle: () => ref.current?.toggle(),
  };
}
