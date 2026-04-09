import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PropConfig, StoryProps } from "../state/storyTypes";

interface ControlsTableProps {
  propsValue: StoryProps;
  propsConfig: Record<string, PropConfig>;
  onPropChange: (key: string, value: string | boolean) => void;
}

function mapControlType(
  type: PropConfig["type"],
): "text" | "select" | "boolean" {
  if (type === "boolean") return "boolean";
  if (type === "select") return "select";
  return "text";
}

export function ControlsTable({
  propsValue,
  propsConfig,
  onPropChange,
}: ControlsTableProps) {
  const [draftProps, setDraftProps] = useState<StoryProps>(propsValue);
  const timersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    setDraftProps(propsValue);
  }, [propsValue]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timerId) =>
        window.clearTimeout(timerId),
      );
    };
  }, []);

  const commitChange = (key: string, value: string | boolean) => {
    if (timersRef.current[key]) {
      window.clearTimeout(timersRef.current[key]);
    }

    timersRef.current[key] = window.setTimeout(() => {
      onPropChange(key, value);
    }, 120);
  };

  const entries = Object.entries(propsConfig);

  if (entries.length === 0) {
    return (
      <p className="text-xs text-[color:var(--bride-text-soft)]">
        No controls available for this story.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="hidden grid-cols-[1fr_1.4fr_1fr] border-b border-[color:var(--bride-border-subtle)] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--bride-text-muted)] md:grid">
        <span>Name</span>
        <span>Description</span>
        <span className="text-right">Control</span>
      </div>
      <div>
        {entries.map(([key, config]) => {
          const value = draftProps[key] ?? config.default;
          const controlType = mapControlType(config.type);
          const options = config.options ?? [];
          return (
            <div
              key={key}
              className="grid gap-3 border-b border-[color:var(--bride-border-subtle)] px-4 py-4 last:border-b-0 md:grid-cols-[1fr_1.4fr_1fr] md:items-center"
            >
              <div className="space-y-1">
                <span className="block text-sm font-medium capitalize text-[color:var(--bride-text)]">
                  {key}
                </span>
                <span className="block text-xs text-[color:var(--bride-text-muted)]">
                  {config.type}
                </span>
              </div>
              <span className="text-xs leading-6 text-[color:var(--bride-text-muted)]">
                {config.description ?? "Story prop"}
              </span>
              <div className="md:justify-self-end">
                {controlType === "boolean" ? (
                  <Switch.Root
                    checked={Boolean(value)}
                    onCheckedChange={(nextValue) => {
                      setDraftProps((current) => ({
                        ...current,
                        [key]: nextValue,
                      }));
                      commitChange(key, nextValue);
                    }}
                    className="bride-focus-ring relative inline-flex h-6 w-11 items-center rounded-full border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-field-bg)] transition-all duration-200 data-[state=checked]:border-[color:var(--docs-accent-border)] data-[state=checked]:bg-[color:var(--docs-accent-surface)] data-[state=checked]:shadow-[0_0_16px_var(--docs-accent-glow)]"
                  >
                    <Switch.Thumb className="block h-[18px] w-[18px] translate-x-1 rounded-full bg-[color:var(--bride-text)] shadow-[0_0_10px_var(--bride-glow)] transition-transform duration-200 data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-[color:var(--docs-accent-strong)]" />
                  </Switch.Root>
                ) : controlType === "select" ? (
                  <Select.Root
                    value={String(value)}
                    onValueChange={(nextValue: any) => {
                      setDraftProps((current) => ({
                        ...current,
                        [key]: nextValue,
                      }));
                      commitChange(key, nextValue);
                    }}
                  >
                    <Select.Trigger className="inline-flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-[10px] border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-field-bg)] px-3 text-sm capitalize text-[color:var(--bride-text)] shadow-[inset_0_1px_0_var(--bride-border-subtle)] outline-none transition-all duration-200 focus:border-[color:var(--docs-accent)] focus:shadow-[0_0_0_2px_var(--docs-accent-glow)] md:min-w-[200px]">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDown
                          size={14}
                          className="text-[color:var(--bride-text-muted)]"
                        />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content
                        position="popper"
                        sideOffset={8}
                        className="z-50 min-w-[min(200px,calc(100vw-32px))] overflow-hidden rounded-xl border border-[color:var(--bride-border-subtle)] bg-[var(--bride-glass-dark)] shadow-[inset_0_1px_0_var(--bride-border-subtle)] backdrop-blur-[18px]"
                      >
                        <Select.Viewport className="p-1">
                          {options.map((option) => (
                            <Select.Item
                              key={option}
                              value={option}
                              className="relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-xs capitalize text-[color:var(--bride-text-muted)] outline-none transition-all duration-200 hover:bg-[color:var(--docs-accent-surface)] data-[state=checked]:bg-[color:var(--docs-accent-surface)] data-[state=checked]:text-[color:var(--bride-text)]"
                            >
                              <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                                <Check
                                  size={12}
                                  className="text-[color:var(--docs-accent-strong)]"
                                />
                              </Select.ItemIndicator>
                              <Select.ItemText>{option}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                ) : (
                  <input
                    value={String(value)}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setDraftProps((current) => ({
                        ...current,
                        [key]: nextValue,
                      }));
                      commitChange(key, nextValue);
                    }}
                    className="h-10 w-full min-w-0 rounded-[10px] border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-field-bg)] px-3 text-sm text-[color:var(--bride-text)] shadow-[inset_0_1px_0_var(--bride-border-subtle)] outline-none transition-all duration-200 placeholder:text-[color:var(--bride-text-muted)] focus:border-[color:var(--docs-accent)] focus:shadow-[0_0_0_2px_var(--docs-accent-glow)] md:min-w-[200px]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
