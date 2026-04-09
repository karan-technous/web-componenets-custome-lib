import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import {
  Atom,
  Boxes,
  ExternalLink,
  Menu,
  Moon,
  PanelBottom,
  RefreshCw,
  RotateCcw,
  Sun,
  Triangle,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Framework } from "../state/frameworkStore";
import type { SelectedStory } from "../state/storyTypes";
import type { AppearanceMode } from "../theme/themeManager";

interface ToolbarProps {
  framework: Framework;
  selection: SelectedStory | null;
  currentUrl: string;
  appearance: AppearanceMode;
  onFrameworkChange: (framework: Framework) => void;
  onAppearanceChange: (appearance: AppearanceMode) => void;
  zoom: number;
  mode: "preview" | "docs";
  onModeChange: (mode: "preview" | "docs") => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onRefresh: () => void;
  onOpenNewTab: () => void;
  showPanel: boolean;
  onTogglePanel: () => void;
  showSidebarToggle: boolean;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.16 }}
      onClick={onClick}
      className="bride-focus-ring relative inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-bg-elevated)] text-[color:var(--bride-text-muted)] shadow-[inset_0_1px_0_var(--bride-border-subtle)] transition-all duration-200 hover:text-[color:var(--bride-text)] hover:brightness-110 hover:shadow-[0_0_18px_var(--bride-glow)]"
      title={label}
      aria-label={label}
    >
      {children}
    </motion.button>
  );
}

const frameworks: Array<{
  value: Framework;
  label: string;
  icon: typeof Triangle;
}> = [
  { value: "angular", label: "Angular", icon: Triangle },
  { value: "react", label: "React", icon: Atom },
  { value: "wc", label: "Web Components", icon: Boxes },
];

export function Toolbar({
  framework,
  selection,
  currentUrl,
  appearance,
  onFrameworkChange,
  onAppearanceChange,
  zoom,
  mode,
  onModeChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onRefresh,
  onOpenNewTab,
  showPanel,
  onTogglePanel,
  showSidebarToggle,
  isSidebarOpen,
  onToggleSidebar,
}: ToolbarProps) {
  return (
    <header className="relative overflow-hidden border-b border-[color:var(--bride-border-subtle)] bg-[var(--bride-bg-elevated)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,var(--docs-accent-glow),transparent_35%)] opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--docs-accent-border),transparent)]" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
            {showSidebarToggle ? (
              <ToolButton
                label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                onClick={onToggleSidebar}
              >
                <Menu
                  size={14}
                  className={
                    isSidebarOpen ? "text-[color:var(--bride-primary-light)]" : ""
                  }
                />
              </ToolButton>
            ) : null}
            <Tabs.Root
              value={framework}
              onValueChange={(value) => onFrameworkChange(value as Framework)}
              className="min-w-0"
            >
              <Tabs.List className="relative flex items-center gap-1 border-r border-[color:var(--bride-border-subtle)] pr-2 sm:pr-3">
                {frameworks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Tabs.Trigger
                      key={item.value}
                      value={item.value}
                      className="bride-focus-ring inline-flex items-center gap-1.5 rounded-xl border border-transparent px-2.5 py-1.5 text-xs font-medium text-[color:var(--bride-text-muted)] transition-all duration-200 hover:text-[color:var(--bride-text)] data-[state=active]:border-[color:var(--docs-accent-border)] data-[state=active]:bg-[color:var(--docs-accent-surface)] data-[state=active]:text-[color:var(--bride-primary)] data-[state=active]:shadow-[0_0_18px_var(--docs-accent-glow)] sm:px-3"
                    >
                      <Icon size={12} />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>
            </Tabs.Root>

            <Tabs.Root
              value={mode}
              onValueChange={(value) =>
                onModeChange(value as "preview" | "docs")
              }
            >
              <Tabs.List className="flex items-center gap-1 pl-0">
                <Tabs.Trigger
                  value="preview"
                  className="bride-focus-ring relative rounded-xl border border-transparent px-3 py-1.5 text-xs font-semibold text-[color:var(--bride-text-muted)] transition-all duration-200 hover:text-[color:var(--bride-text)] data-[state=active]:border-[color:var(--docs-accent-border)] data-[state=active]:bg-[color:var(--docs-accent-surface)] data-[state=active]:text-[color:var(--docs-accent-strong)] data-[state=active]:shadow-[0_0_20px_var(--docs-accent-glow)] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-3 data-[state=active]:after:right-3 data-[state=active]:after:h-px data-[state=active]:after:bg-[color:var(--docs-accent-strong)] sm:px-4"
                >
                  Preview
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="docs"
                  className="bride-focus-ring relative rounded-xl border border-transparent px-3 py-1.5 text-xs font-semibold text-[color:var(--bride-text-muted)] transition-all duration-200 hover:text-[color:var(--bride-text)] data-[state=active]:border-[color:var(--docs-accent-border)] data-[state=active]:bg-[color:var(--docs-accent-surface)] data-[state=active]:text-[color:var(--docs-accent-strong)] data-[state=active]:shadow-[0_0_20px_var(--docs-accent-glow)] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-3 data-[state=active]:after:right-3 data-[state=active]:after:h-px data-[state=active]:after:bg-[color:var(--docs-accent-strong)] sm:px-4"
                >
                  Docs
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </div>

          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
            <div className="flex items-center rounded-xl border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-bg-elevated)] p-1 shadow-[inset_0_1px_0_var(--bride-border-subtle)]">
              <button
                type="button"
                onClick={() => onAppearanceChange("dark")}
                className={`bride-focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-3 ${
                  appearance === "dark"
                    ? "border border-[color:var(--docs-accent-border)] bg-[color:var(--docs-accent-surface)] text-[color:var(--docs-accent-strong)] shadow-[0_0_16px_var(--docs-accent-glow)]"
                    : "border border-transparent text-[color:var(--bride-text-muted)] hover:text-[color:var(--bride-text)]"
                }`}
              >
                <Moon size={12} />
                Dark
              </button>
              <button
                type="button"
                onClick={() => onAppearanceChange("light")}
                className={`bride-focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-3 ${
                  appearance === "light"
                    ? "border border-[color:var(--docs-accent-border)] bg-[color:var(--docs-accent-surface)] text-[color:var(--docs-accent-strong)] shadow-[0_0_16px_var(--docs-accent-glow)]"
                    : "border border-transparent text-[color:var(--bride-text-muted)] hover:text-[color:var(--bride-text)]"
                }`}
              >
                <Sun size={12} />
                Light
              </button>
            </div>
            <div className="hidden items-center gap-1 xl:flex">
              <ToolButton label="Zoom in" onClick={onZoomIn}>
                <ZoomIn size={14} />
              </ToolButton>
              <ToolButton label="Zoom out" onClick={onZoomOut}>
                <ZoomOut size={14} />
              </ToolButton>
              <ToolButton label="Reset zoom" onClick={onResetZoom}>
                <RotateCcw size={14} />
              </ToolButton>
              <ToolButton label="Refresh preview" onClick={onRefresh}>
                <RefreshCw size={14} />
              </ToolButton>
              <ToolButton label="Open in new tab" onClick={onOpenNewTab}>
                <ExternalLink size={14} />
              </ToolButton>
              <ToolButton label="Toggle panel" onClick={onTogglePanel}>
                <PanelBottom
                  size={14}
                  className={
                    showPanel ? "text-[color:var(--bride-primary-light)]" : ""
                  }
                />
              </ToolButton>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1 xl:hidden">
                <ToolButton label="Refresh preview" onClick={onRefresh}>
                  <RefreshCw size={14} />
                </ToolButton>
                <ToolButton label="Toggle panel" onClick={onTogglePanel}>
                  <PanelBottom
                    size={14}
                    className={
                      showPanel ? "text-[color:var(--bride-primary-light)]" : ""
                    }
                  />
                </ToolButton>
              </div>
              <span className="rounded-lg border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-bg-elevated)] px-2 py-1 text-xs font-semibold text-[color:var(--bride-text-muted)] shadow-[inset_0_1px_0_var(--bride-border-subtle)]">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[color:var(--bride-border-subtle)] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 text-xs text-[color:var(--bride-text-muted)]">
            {selection ? (
              <>
                Components / {selection.componentTitle} /{" "}
                <span className="rounded-full border border-[color:var(--docs-accent-border)] bg-[color:var(--docs-accent-surface)] px-2 py-0.5 font-semibold text-[color:var(--bride-primary)]">
                  {selection.storyName}
                </span>
              </>
            ) : (
              "No story selected"
            )}
          </p>
          <a
            href={currentUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className="bride-focus-ring inline-flex w-fit items-center gap-1 rounded-lg border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-bg-elevated)] px-2 py-1 text-xs text-[color:var(--bride-text-muted)] transition-all duration-200 hover:text-[color:var(--bride-text)] hover:shadow-[0_0_12px_var(--docs-accent-glow)]"
          >
            <ExternalLink size={12} />
            Open in full
          </a>
        </div>
      </div>
    </header>
  );
}
