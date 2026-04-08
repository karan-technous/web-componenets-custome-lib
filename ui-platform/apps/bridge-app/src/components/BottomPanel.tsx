import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, SlidersHorizontal, Sparkles } from "lucide-react";
import { useRef } from "react";
import { ActionsPanel, type ActionLogEntry } from "./ActionsPanel";
import { ControlsTable } from "./ControlsTable";
import type { PropConfig, StoryProps } from "../state/storyTypes";

export type BottomTab = "controls" | "actions" | "interactions";

interface BottomPanelProps {
  show: boolean;
  height: number;
  onHeightChange: (height: number) => void;
  activeTab: BottomTab;
  propsValue: StoryProps;
  propsConfig: Record<string, PropConfig>;
  actionLogs: ActionLogEntry[];
  onTabChange: (tab: BottomTab) => void;
  onPropChange: (key: string, value: string | boolean) => void;
}

const tabs: Array<{ id: BottomTab; label: string; icon: typeof SlidersHorizontal }> = [
  { id: "controls", label: "Controls", icon: SlidersHorizontal },
  { id: "actions", label: "Actions", icon: Activity },
  { id: "interactions", label: "Interactions", icon: Sparkles },
];

export function BottomPanel({
  show,
  height,
  onHeightChange,
  activeTab,
  propsValue,
  propsConfig,
  actionLogs,
  onTabChange,
  onPropChange,
}: BottomPanelProps) {
  const propsCount = Object.keys(propsConfig).length;
  const sectionRef = useRef<HTMLElement | null>(null);

  const handleResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    event.currentTarget.setPointerCapture(event.pointerId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const viewportHeight = window.innerHeight;
      const rawHeight = viewportHeight - moveEvent.clientY;
      const maxHeight = Math.min(Math.round(viewportHeight * 0.62), viewportHeight - 140);
      const nextHeight = Math.min(
        Math.max(220, rawHeight),
        Math.max(220, maxHeight),
      );
      onHeightChange(nextHeight);
    };

    const onPointerUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.section
          ref={sectionRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          className="relative z-20 border-t border-[color:var(--bride-border-subtle)]"
          style={{ height }}
        >
          <div
            onPointerDown={handleResizeStart}
            className="absolute inset-x-0 top-0 z-30 h-3 -translate-y-1/2 cursor-row-resize"
          >
            <div className="mx-auto mt-1 h-1 w-16 rounded-full bg-[color:var(--docs-accent-border)] transition-all duration-200 hover:bg-[color:var(--docs-accent-strong)]" />
          </div>
          <Tabs.Root
            value={activeTab}
            onValueChange={(value) => onTabChange(value as BottomTab)}
            className="h-full bg-[var(--bride-glass-surface)] shadow-[inset_0_1px_0_var(--bride-border-subtle)] backdrop-blur-[12px]"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--bride-border-subtle)] px-4 py-3">
              <Tabs.List className="flex items-center gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Tabs.Trigger
                      key={tab.id}
                      value={tab.id}
                      className="bride-focus-ring inline-flex items-center gap-1.5 rounded-xl border border-transparent px-3 py-1.5 text-xs font-medium text-[color:var(--bride-text-muted)] transition-all duration-200 hover:text-[color:var(--bride-text)] data-[state=active]:border-[color:var(--docs-accent-border)] data-[state=active]:bg-[color:var(--docs-accent-surface)] data-[state=active]:text-[color:var(--bride-text)] data-[state=active]:shadow-[0_0_16px_var(--docs-accent-glow)]"
                    >
                      <Icon size={12} />
                      {tab.label}
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>
              <div className="rounded-full border border-[color:var(--docs-accent-border)] bg-[color:var(--docs-accent-surface)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--docs-accent-strong)]">
                Props
                <span className="ml-2 text-[color:var(--bride-text-muted)]">
                  {propsCount} props
                </span>
              </div>
            </div>

            <Tabs.Content value="controls" className="h-[calc(100%-61px)] overflow-auto p-0">
              <ControlsTable
                propsValue={propsValue}
                propsConfig={propsConfig}
                onPropChange={onPropChange}
              />
            </Tabs.Content>
            <Tabs.Content value="actions" className="h-[calc(100%-61px)] overflow-auto p-4">
              <ActionsPanel logs={actionLogs} />
            </Tabs.Content>
            <Tabs.Content value="interactions" className="h-[calc(100%-61px)] overflow-auto p-4">
              <p className="text-xs text-[color:var(--bride-text-soft)]">
                No interactions defined.
              </p>
            </Tabs.Content>
          </Tabs.Root>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
