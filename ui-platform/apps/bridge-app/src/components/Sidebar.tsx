import { AnimatePresence, motion } from "framer-motion";
import {
  Atom,
  Boxes,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Hexagon,
  Search,
  Triangle,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Framework } from "../state/frameworkStore";
import type { StoryEntry } from "../state/storyTypes";

interface SidebarProps {
  stories: StoryEntry[];
  framework: Framework;
  selectedStoryId: string;
  selectedStory: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onFrameworkChange: (framework: Framework) => void;
  onSelectStory: (storyId: string, storyName: string) => void;
}

const frameworkOptions: Array<{
  value: Framework;
  label: string;
  version: string;
  icon: typeof Triangle;
}> = [
  { value: "angular", label: "Angular", version: "v16", icon: Triangle },
  { value: "react", label: "React", version: "v19", icon: Atom },
  { value: "wc", label: "Web Components", version: "v1", icon: Boxes },
];

function getCompactLabel(value: string): string {
  const letters = value.match(/[A-Za-z0-9]/g) ?? [];
  return letters[0]?.toUpperCase() ?? "?";
}

export function Sidebar({
  stories,
  framework,
  selectedStoryId,
  selectedStory,
  isCollapsed,
  onToggleCollapse,
  onFrameworkChange,
  onSelectStory,
}: SidebarProps) {
  const initialGroups = useMemo(
    () =>
      stories.reduce<Record<string, boolean>>((acc, group) => {
        acc[group.definition.id] = true;
        return acc;
      }, {}),
    [stories],
  );
  const [openGroups, setOpenGroups] =
    useState<Record<string, boolean>>(initialGroups);
  const [query, setQuery] = useState("");

  const toggleGroup = (title: string) => {
    setOpenGroups((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  return (
    <motion.aside
      initial={{ x: -8, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="relative flex h-full min-h-0 flex-col overflow-visible border border-[color:var(--bride-border-subtle)] bg-[var(--bride-glass-dark)] shadow-[0_22px_44px_var(--bride-glow),inset_0_1px_0_var(--bride-border-subtle)] transition-[width] duration-300 ease-out"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 140% 42% at 50% -8%, rgba(var(--bride-primary-rgb), 0.045) 0%, transparent 62%),
            radial-gradient(ellipse 75% 24% at 0% 100%, rgba(var(--bride-secondary-rgb), 0.025) 0%, transparent 72%)
          `,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27 opacity=%270.06%27/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "1px",
          zIndex: 100,
          background: `
      linear-gradient(
        90deg,
        transparent 0%,
        color-mix(in srgb, var(--bride-primary) 60%, transparent) 40%,
        color-mix(in srgb, var(--bride-primary) 80%, var(--bride-text)) 70%,
        transparent 100%
      )
    `,
        }}
      />
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute right-0 top-11 z-30 hidden h-7 w-7 translate-x-1/2 items-center justify-center rounded-full border text-[color:var(--bride-primary-light)] transition hover:scale-[1.03] lg:flex"
        style={{
          borderColor: "rgba(var(--bride-primary-rgb), 0.7)",
          background:
            "radial-gradient(circle at 30% 30%, rgba(var(--bride-primary-rgb), 0.24), var(--bride-bg-elevated) 72%)",
          boxShadow: `
            0 0 0 2px var(--bride-bg),
            0 0 0 4px rgba(var(--bride-primary-rgb), 0.18),
            0 12px 28px rgba(var(--bride-primary-rgb), 0.16),
            0 0 18px rgba(var(--bride-primary-rgb), 0.28)
          `,
        }}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
      <div
        className={`relative z-10 flex h-full min-h-0 flex-col px-3 pb-3 pt-3 ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        <div
          className={`mb-4 flex border-b border-[color:var(--bride-border-subtle)] pb-2 ${
            isCollapsed ? "justify-center" : "items-center justify-between"
          }`}
        >
          <div className="flex gap-3">
            <div
              className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `
                  linear-gradient(
                    135deg,
                    rgba(var(--bride-primary-rgb), 0.22) 0%,
                    rgba(var(--bride-secondary-rgb), 0.1) 100%
                  )
                `,
                border: "1px solid rgba(var(--bride-primary-rgb), 0.26)",
                boxShadow: `
                  0 0 12px rgba(var(--bride-primary-rgb), 0.14),
                  inset 0 1px 0 var(--bride-border-subtle)
                `,
              }}
            >
              <Hexagon
                className="h-4 w-4"
                strokeWidth={1.5}
                style={{ color: "var(--bride-primary-light)" }}
              />
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: `
                  linear-gradient(
                    135deg,
                    color-mix(in srgb, var(--bride-text) 18%, transparent) 0%,
                    transparent 60%
                  )
                `,
                }}
              />
            </div>
            {!isCollapsed ? (
              <div>
                <p className="font-[var(--bride-font-display)] text-[15px] font-semibold tracking-[-0.02em] text-[color:var(--bride-text)]">
                  UI Platform
                </p>
                <p className="text-[10px] uppercase tracking-[0.08em] text-[color:var(--bride-text-muted)]">
                  Design System
                </p>
              </div>
            ) : null}
          </div>

          {!isCollapsed ? (
            <div
              className="mt-1 h-1.5 w-1.5 rounded-full"
              style={{
                background: "var(--bride-primary)",
                boxShadow: "0 0 6px rgba(var(--bride-primary-rgb), 0.5)",
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            />
          ) : null}
        </div>

        {!isCollapsed ? (
          <div className="relative mb-4">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--bride-text-muted)]"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search components..."
              className="bride-input h-10 w-full rounded-[13px] pl-9 pr-3 text-sm outline-none transition placeholder:text-[color:var(--bride-text-muted)] focus:border-[color:rgba(var(--bride-primary-rgb),0.18)] focus:bg-[rgba(var(--bride-primary-rgb),0.035)] focus:shadow-[0_0_0_3px_rgba(var(--bride-primary-rgb),0.08)]"
            />
          </div>
        ) : null}
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto sidebar-scroll">
          {!isCollapsed ? (
            <div
              className="px-1 mb-2 flex items-center gap-2"
              style={{
                color: "var(--bride-text-muted)",
                fontSize: "10px",
                letterSpacing: "0.1em",
              }}
            >
              <div
                className="flex-1 h-px"
                style={{
                  background: "var(--bride-border-subtle)",
                }}
              />

              <span
                style={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Components
              </span>

              <div
                className="flex-1 h-px"
                style={{
                  background: "var(--bride-border-subtle)",
                }}
              />
            </div>
          ) : null}

          <div
            className={`min-h-0 flex-1 space-y-2 ${isCollapsed ? "" : "pr-1"}`}
          >
            {stories.map((group) => {
              const matchesGroup = group.definition.title
                .toLowerCase()
                .includes(query.toLowerCase());
              const filteredStories = group.variants.filter((story) =>
                story.name.toLowerCase().includes(query.toLowerCase()),
              );

              if (!matchesGroup && filteredStories.length === 0) {
                return null;
              }

              const isOpen = openGroups[group.definition.id] ?? true;
              const isActiveGroup = selectedStoryId === group.definition.id;
              const compactStory =
                group.variants.find((story) => story.name === selectedStory) ??
                filteredStories[0] ??
                group.variants[0];
              const compactLabel = getCompactLabel(group.definition.title);

              return (
                <div key={group.definition.id} className="mb-0.5">
                  <button
                    onClick={() => {
                      if (isCollapsed) {
                        if (compactStory) {
                          onSelectStory(group.definition.id, compactStory.name);
                        }
                        return;
                      }
                      toggleGroup(group.definition.id);
                    }}
                    title={group.definition.title}
                    className={`relative flex w-full items-center rounded-[14px] border text-left transition-all ${
                      isActiveGroup
                        ? "border-[rgba(var(--bride-primary-rgb),0.18)] bg-[linear-gradient(90deg,rgba(var(--bride-primary-rgb),0.12)_0%,rgba(var(--bride-primary-rgb),0.04)_100%)] shadow-[0_0_12px_rgba(var(--bride-primary-rgb),0.05),inset_0_1px_0_var(--bride-border-subtle)]"
                        : "border-transparent hover:border-[color:var(--bride-border-subtle)] hover:bg-[color:var(--docs-accent-surface)]"
                    } ${
                      isCollapsed
                        ? "mx-auto h-10 w-10 justify-center rounded-[14px] px-0 py-0"
                        : "justify-between px-3 py-2"
                    }`}
                  >
                    {isActiveGroup ? (
                      <div className="absolute left-0 top-1/2 h-[55%] w-[2.5px] -translate-y-1/2 rounded-r-full bg-[color:var(--bride-primary-light)] shadow-[0_0_5px_rgba(var(--bride-primary-rgb),0.32)]" />
                    ) : null}
                    <div
                      className={`flex items-center ${isCollapsed ? "" : "gap-2"}`}
                    >
                      {!isCollapsed ? (
                        isOpen ? (
                          <ChevronDown
                            size={12}
                            className={
                              isActiveGroup
                                ? "text-[color:var(--bride-primary)]"
                                : "text-[color:var(--bride-text-muted)]"
                            }
                          />
                        ) : (
                          <ChevronRight
                            size={12}
                            className={
                              isActiveGroup
                                ? "text-[color:var(--bride-primary)]"
                                : "text-[color:var(--bride-text-muted)]"
                            }
                          />
                        )
                      ) : null}
                      {isCollapsed ? (
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-[9px] border text-[13px] font-semibold tracking-[0.02em] ${
                            isActiveGroup
                              ? "border-[rgba(var(--bride-primary-rgb),0.35)] bg-[rgba(var(--bride-primary-rgb),0.14)] text-[color:var(--bride-primary-light)] shadow-[0_0_14px_rgba(var(--bride-primary-rgb),0.22)]"
                              : "border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-field-bg)] text-[color:var(--bride-text-muted)] shadow-[inset_0_1px_0_var(--bride-border-subtle)]"
                          }`}
                        >
                          {compactLabel}
                        </span>
                      ) : (
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            isActiveGroup
                              ? "bg-[color:var(--bride-primary)] shadow-[0_0_6px_rgba(var(--bride-primary-rgb),0.7)]"
                              : "bg-[color:var(--bride-text-muted)]"
                          }`}
                        />
                      )}
                      {!isCollapsed ? (
                        <span
                          className={`text-xs ${
                            isActiveGroup
                              ? "font-medium text-[color:var(--bride-primary)]"
                              : "text-[color:var(--bride-text-soft)]"
                          }`}
                        >
                          {group.definition.title}
                        </span>
                      ) : null}
                    </div>
                    {!isCollapsed ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                          isActiveGroup
                            ? "bg-[rgba(var(--bride-primary-rgb),0.08)] text-[color:var(--bride-primary)]"
                            : "bg-[color:var(--bride-field-bg)] text-[color:var(--bride-text-muted)]"
                        }`}
                      >
                        {group.variants.length}
                      </span>
                    ) : null}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && !isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-5 mt-1 space-y-1 border-l border-[rgba(var(--bride-primary-rgb),0.1)] pl-3">
                          {filteredStories.map((story) => {
                            const active =
                              selectedStoryId === group.definition.id &&
                              selectedStory === story.name;
                            return (
                              <motion.button
                                key={story.name}
                                whileHover={{ x: 1 }}
                                onClick={() =>
                                  onSelectStory(group.definition.id, story.name)
                                }
                                className={`w-full rounded-[12px] border px-3 py-1.5 text-left text-sm transition-all ${
                                  active
                                    ? "border-[rgba(var(--bride-primary-rgb),0.24)] bg-[linear-gradient(90deg,rgba(var(--bride-primary-rgb),0.12)_0%,rgba(var(--bride-primary-rgb),0.06)_100%)] text-[color:var(--bride-primary-light)]"
                                    : "border-transparent text-[color:var(--bride-text-muted)] hover:bg-[color:var(--docs-accent-surface)]"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`h-1 w-1 rounded-full ${
                                      active
                                        ? "bg-[color:var(--bride-primary)] shadow-[0_0_4px_rgba(var(--bride-primary-rgb),0.7)]"
                                        : "bg-[color:var(--bride-text-muted)]"
                                    }`}
                                  />
                                  {story.name}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={`relative mt-3 flex border-t border-[color:var(--bride-border-subtle)] px-1 pt-3 ${
            isCollapsed ? "justify-center" : "items-center justify-between"
          }`}
        >
          <div className="flex items-center gap-2 rounded-full border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-field-bg)] px-3 py-1.5 text-[11px] text-[color:var(--bride-text-muted)]">
            <Hexagon
              size={11}
              className="text-[color:var(--bride-text-muted)]"
            />
            {!isCollapsed ? <span>v1.0.1</span> : null}
          </div>
          {!isCollapsed ? (
            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(var(--bride-primary-rgb),0.12)] bg-[rgba(var(--bride-primary-rgb),0.06)] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--bride-primary)] shadow-[0_0_4px_rgba(var(--bride-primary-rgb),0.45)]" />
              <span className="text-[9px] font-bold tracking-[0.08em] text-[color:var(--bride-primary)]">
                LIVE
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </motion.aside>
  );
}
