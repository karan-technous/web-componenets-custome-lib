import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { TabIconClickDetail, TabItem } from "@karan9186/core/dist/types/tabs.types";

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

export interface TabsProps {
  tabs: TabItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  scrollable?: boolean;
  customTooltipClass?: string;
  tagColor?: string;
  onChange?: (index: number, tab: TabItem) => void;
  onSelectedTab?: (tab: TabItem) => void;
  onIconClick?: (detail: TabIconClickDetail) => void;
  [key: string]: any;
}

export interface TabsRef {
  readonly element: HTMLElement | null;
  changeTab: (index: number) => Promise<void>;
  getHeader: () => Promise<HTMLElement | null>;
}

type UiTabsElement = HTMLElement & {
  tabs?: TabItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  scrollable?: boolean;
  customTooltipClass?: string;
  tagColor?: string;
  changeTab?: (index: number) => Promise<void>;
  getHeader?: () => Promise<HTMLElement>;
};

export const Tabs = forwardRef<TabsRef, TabsProps>(
  (
    {
      tabs,
      activeIndex,
      defaultActiveIndex = 0,
      scrollable = false,
      customTooltipClass,
      tagColor,
      onChange,
      onSelectedTab,
      onIconClick,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<UiTabsElement>(null);
    const selectedTabRef = useRef<TabItem | undefined>(tabs[defaultActiveIndex]);

    const [state, setState] = useControllableState<number>({
      value: activeIndex,
      defaultValue: defaultActiveIndex,
    });

    useImperativeHandle(
      ref,
      () => ({
        get element() {
          return innerRef.current;
        },
        changeTab: async (index: number) => {
          await innerRef.current?.changeTab?.(index);
        },
        getHeader: async () => {
          return (await innerRef.current?.getHeader?.()) ?? null;
        },
      }),
      [],
    );

    useEffect(() => {
      const el = innerRef.current;
      if (!el) {
        return;
      }

      el.tabs = tabs;
      el.activeIndex = state;
      el.defaultActiveIndex = defaultActiveIndex;
      el.scrollable = scrollable;
      el.customTooltipClass = customTooltipClass;
      el.tagColor = tagColor;

      Object.assign(el, rest);
    }, [tabs, state, defaultActiveIndex, scrollable, customTooltipClass, tagColor, rest]);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) {
        return;
      }

      const handleIndexChange = (event: Event) => {
        setState((event as CustomEvent<number>).detail ?? 0);
      };

      const handleSelectedTab = (event: Event) => {
        const detail = (event as CustomEvent<TabItem>).detail;
        selectedTabRef.current = detail;
        const index = typeof el.activeIndex === "number" ? el.activeIndex : state;
        onSelectedTab?.(detail);
        onChange?.(index, detail);
      };

      const handleIconClick = (event: Event) => {
        onIconClick?.((event as CustomEvent<TabIconClickDetail>).detail);
      };

      el.addEventListener("getTabIndex", handleIndexChange);
      el.addEventListener("getSelectedTab", handleSelectedTab);
      el.addEventListener("tabIconClicked", handleIconClick);

      return () => {
        el.removeEventListener("getTabIndex", handleIndexChange);
        el.removeEventListener("getSelectedTab", handleSelectedTab);
        el.removeEventListener("tabIconClicked", handleIconClick);
      };
    }, [onChange, onIconClick, onSelectedTab, setState, state]);

    return <ui-tabs ref={innerRef} />;
  },
);

Tabs.displayName = "Tabs";

export function useTabs() {
  const ref = useRef<TabsRef>(null);

  return {
    ref,
    changeTab: (index: number) => ref.current?.changeTab(index),
    getHeader: () => ref.current?.getHeader(),
  };
}
