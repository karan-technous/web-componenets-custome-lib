import { useState, useCallback } from 'react';

export interface BreadcrumbItem {
  value: string;
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  icon?: string;
}

export interface UseBreadcrumbReturn {
  items: BreadcrumbItem[];
  activeItem: BreadcrumbItem | null;
  navigate: (value: string) => void;
  addItem: (item: BreadcrumbItem) => void;
  removeItem: (value: string) => void;
  reset: () => void;
}

export function useBreadcrumb(initialItems: BreadcrumbItem[] = []): UseBreadcrumbReturn {
  const [items, setItems] = useState<BreadcrumbItem[]>(initialItems);

  const activeItem = items.find((item) => item.active) || items[items.length - 1] || null;

  const navigate = useCallback((value: string) => {
    const index = items.findIndex((item) => item.value === value);
    if (index !== -1 && !items[index].disabled) {
      setItems((prev) =>
        prev.map((item, i) => ({
          ...item,
          active: i <= index,
        })),
      );
    }
  }, [items]);

  const addItem = useCallback((item: BreadcrumbItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const removeItem = useCallback((value: string) => {
    setItems((prev) => prev.filter((item) => item.value !== value));
  }, []);

  const reset = useCallback(() => {
    setItems(initialItems);
  }, [initialItems]);

  return {
    items,
    activeItem,
    navigate,
    addItem,
    removeItem,
    reset,
  };
}
