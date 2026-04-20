import { useState, useCallback } from 'react';

export interface UsePanelOptions {
  /** Controlled expanded state */
  expanded?: boolean;
  /** Initial expanded state */
  defaultExpanded?: boolean;
  /** Callback when expanded state changes */
  onToggle?: (expanded: boolean) => void;
}

export interface UsePanelReturn {
  /** Current expanded state */
  expanded: boolean;
  /** Toggle expanded state */
  toggle: () => void;
  /** Expand panel */
  expand: () => void;
  /** Collapse panel */
  collapse: () => void;
}

export function usePanel(options: UsePanelOptions = {}): UsePanelReturn {
  const { expanded: controlledExpanded, defaultExpanded = true, onToggle } = options;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = typeof controlledExpanded === 'boolean';
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const setExpanded = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalExpanded(next);
      }
      onToggle?.(next);
    },
    [isControlled, onToggle],
  );

  const toggle = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);

  const expand = useCallback(() => {
    setExpanded(true);
  }, [setExpanded]);

  const collapse = useCallback(() => {
    setExpanded(false);
  }, [setExpanded]);

  return {
    expanded,
    toggle,
    expand,
    collapse,
  };
}
