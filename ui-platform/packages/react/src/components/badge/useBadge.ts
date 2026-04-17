import { useState, useCallback } from 'react';

export interface UseBadgeOptions {
  /** Initial visibility state */
  defaultVisible?: boolean;
  /** Callback when badge is removed */
  onRemove?: () => void;
}

export interface UseBadgeReturn {
  /** Current visibility state */
  visible: boolean;
  /** Function to hide the badge */
  remove: () => void;
  /** Function to show the badge */
  show: () => void;
  /** Function to toggle visibility */
  toggle: () => void;
}

/**
 * React hook for managing badge visibility state
 * 
 * @example
 * ```tsx
 * const { visible, remove, show } = useBadge({
 *   defaultVisible: true,
 *   onRemove: () => console.log('Badge removed')
 * });
 * ```
 */
export function useBadge(options: UseBadgeOptions = {}): UseBadgeReturn {
  const { defaultVisible = true, onRemove } = options;
  const [visible, setVisible] = useState(defaultVisible);

  const remove = useCallback(() => {
    setVisible(false);
    onRemove?.();
  }, [onRemove]);

  const show = useCallback(() => {
    setVisible(true);
  }, []);

  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return {
    visible,
    remove,
    show,
    toggle,
  };
}
