import { useState, useCallback } from 'react';

export interface UsePanelOptions {
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
  const { defaultExpanded = true, onToggle } = options;
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  }, [onToggle]);

  const expand = useCallback(() => {
    setExpanded(true);
    onToggle?.(true);
  }, [onToggle]);

  const collapse = useCallback(() => {
    setExpanded(false);
    onToggle?.(false);
  }, [onToggle]);

  return {
    expanded,
    toggle,
    expand,
    collapse,
  };
}
