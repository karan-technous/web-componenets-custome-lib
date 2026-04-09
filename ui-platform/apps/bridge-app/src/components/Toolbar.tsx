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
  icon: any;
}> = [
  {
    value: "angular",
    label: "Angular",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 223 236" height="14">
        <defs>
          <linearGradient
            id="a"
            x1="49.009"
            x2="225.829"
            y1="213.75"
            y2="129.722"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#E40035" />
            <stop offset=".24" stop-color="#F60A48" />
            <stop offset=".352" stop-color="#F20755" />
            <stop offset=".494" stop-color="#DC087D" />
            <stop offset=".745" stop-color="#9717E7" />
            <stop offset="1" stop-color="#6C00F5" />
          </linearGradient>

          <linearGradient
            id="b"
            x1="41.025"
            x2="156.741"
            y1="28.344"
            y2="160.344"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF31D9" />
            <stop offset="1" stop-color="#FF5BE1" stop-opacity="0" />
          </linearGradient>
        </defs>

        <g>
          <path
            fill="url(#a)"
            d="m222.077 39.192-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z"
          />

          <path
            fill="url(#b)"
            d="m222.077 39.192-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z"
          />
        </g>
      </svg>
    ),
  },
  {
    value: "react",
    label: "React",
    icon: (
      <svg
        viewBox="-11.5 -10.23174 23 20.46348"
        xmlns="http://www.w3.org/2000/svg"
        height={14}
      >
        <rect
          x="-11.5"
          y="-10.23174"
          width="23"
          height="20.46348"
          fill="#20232a00"
        />

        <title>React Logo</title>
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" stroke-width="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    value: "wc",
    label: "Web Components",
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" height={20}>
        <title>Web Components Icon</title>
        <path
          fill="#263238"
          d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z"
          opacity=".1"
        />

        <path
          fill="#536DFE"
          d="M12 2L3.5 6.84V17.16L12 22L20.5 17.16V6.84L12 2ZM19 16.3L12 20.3L5 16.3V7.7L12 3.7L19 7.7V16.3Z"
        />

        <path fill="#536DFE" d="M12 8L8 10.3V14.8L12 17.1L16 14.8V10.3L12 8Z" />
      </svg>
    ),
  },
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
                    isSidebarOpen
                      ? "text-[color:var(--bride-primary-light)]"
                      : ""
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
                      <div>{Icon}</div>
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
