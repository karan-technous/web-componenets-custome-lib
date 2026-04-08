import { AnimatePresence, motion } from "framer-motion";
import {
  Atom,
  Boxes,
  ChevronDown,
  ChevronRight,
  Hexagon,
  Layers,
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

export function Sidebar({
  stories,
  framework,
  selectedStoryId,
  selectedStory,
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
      className="relative flex h-full min-h-0 flex-col overflow-hidden border border-[color:var(--bride-border-subtle)] bg-[var(--bride-glass-dark)] shadow-[0_22px_44px_var(--bride-glow),inset_0_1px_0_var(--bride-border-subtle)]"
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
      <div className="relative z-10 flex h-full min-h-0 flex-col px-3 pb-3 pt-3">
        <div className="mb-4 flex items-center justify-between border-b border-[color:var(--bride-border-subtle)] pb-2">
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
            <div>
              <p className="font-[var(--bride-font-display)] text-[15px] font-semibold tracking-[-0.02em] text-[color:var(--bride-text)]">
                UI Platform
              </p>
              <p className="text-[10px] uppercase tracking-[0.08em] text-[color:var(--bride-text-muted)]">
                Design System
              </p>
            </div>
          </div>

          <div
            className="mt-1 h-1.5 w-1.5 rounded-full"
            style={{
              background: "var(--bride-primary)",
              boxShadow: "0 0 6px rgba(var(--bride-primary-rgb), 0.5)",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
        </div>

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
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto sidebar-scroll">
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
              Framework
            </span>

            <div
              className="flex-1 h-px"
              style={{
                background: "var(--bride-border-subtle)",
              }}
            />
          </div>
          <div className="mb-4 grid gap-2">
            {frameworkOptions.map((item) => {
              const Icon = item.icon;
              const active = framework === item.value;
              return (
                <motion.button
                  key={item.value}
                  whileHover={{ x: 1 }}
                  transition={{ duration: 0.16 }}
                  onClick={() => onFrameworkChange(item.value)}
                  className={`group relative flex items-center justify-between overflow-hidden rounded-[16px] border px-3 py-2.5 text-left transition-all ${
                    active
                      ? "border-[color:rgba(var(--bride-primary-rgb),0.42)] bg-[linear-gradient(90deg,rgba(var(--bride-primary-rgb),0.15)_0%,rgba(var(--bride-primary-rgb),0.05)_100%)] shadow-[0_0_18px_rgba(var(--bride-primary-rgb),0.08),inset_0_1px_0_var(--bride-border-subtle)]"
                      : "border-transparent bg-transparent hover:border-[color:var(--bride-border-subtle)] hover:bg-[color:var(--docs-accent-surface)]"
                  }`}
                >
                  {active ? (
                    <>
                      <div className="absolute left-0 top-1/2 h-[60%] w-[3px] -translate-y-1/2 rounded-r-full bg-[color:var(--bride-primary-light)] shadow-[0_0_6px_rgba(var(--bride-primary-rgb),0.38)]" />
                      <div className="pointer-events-none absolute inset-[2px] rounded-[14px] border border-[rgba(var(--bride-primary-rgb),0.16)]" />
                    </>
                  ) : null}
                  <span className="flex items-center gap-2 text-sm">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-[10px] border ${
                        active
                          ? "border-[rgba(var(--bride-primary-rgb),0.22)] bg-[rgba(var(--bride-primary-rgb),0.12)]"
                          : "border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-field-bg)]"
                      }`}
                    >
                      <Icon
                        size={14}
                        className={
                          active
                            ? "text-[color:var(--bride-primary)]"
                            : "text-[color:var(--bride-text-muted)]"
                        }
                      />
                    </span>
                    <span
                      className={
                        active
                          ? "font-medium text-[color:var(--bride-primary)]"
                          : "text-[color:var(--bride-text-soft)]"
                      }
                    >
                      {item.label}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                      active
                        ? "border border-[rgba(var(--bride-primary-rgb),0.14)] bg-[rgba(var(--bride-primary-rgb),0.1)] text-[color:var(--bride-primary)]"
                        : "border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-field-bg)] text-[color:var(--bride-text-muted)]"
                    }`}
                  >
                    {item.version}
                  </span>
                </motion.button>
              );
            })}
          </div>

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

          <div className="min-h-0 flex-1 space-y-2 pr-1">
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

              return (
                <div key={group.definition.id} className="mb-0.5">
                  <button
                    onClick={() => toggleGroup(group.definition.id)}
                    className={`relative flex w-full items-center justify-between rounded-[14px] border px-3 py-2 text-left transition-all ${
                      isActiveGroup
                        ? "border-[rgba(var(--bride-primary-rgb),0.18)] bg-[linear-gradient(90deg,rgba(var(--bride-primary-rgb),0.12)_0%,rgba(var(--bride-primary-rgb),0.04)_100%)] shadow-[0_0_12px_rgba(var(--bride-primary-rgb),0.05),inset_0_1px_0_var(--bride-border-subtle)]"
                        : "border-transparent hover:border-[color:var(--bride-border-subtle)] hover:bg-[color:var(--docs-accent-surface)]"
                    }`}
                  >
                    {isActiveGroup ? (
                      <div className="absolute left-0 top-1/2 h-[55%] w-[2.5px] -translate-y-1/2 rounded-r-full bg-[color:var(--bride-primary-light)] shadow-[0_0_5px_rgba(var(--bride-primary-rgb),0.32)]" />
                    ) : null}
                    <div className="flex items-center gap-2">
                      {isOpen ? (
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
                      )}
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActiveGroup
                            ? "bg-[color:var(--bride-primary)] shadow-[0_0_6px_rgba(var(--bride-primary-rgb),0.7)]"
                            : "bg-[color:var(--bride-text-muted)]"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          isActiveGroup
                            ? "font-medium text-[color:var(--bride-primary)]"
                            : "text-[color:var(--bride-text-soft)]"
                        }`}
                      >
                        {group.definition.title}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                        isActiveGroup
                          ? "bg-[rgba(var(--bride-primary-rgb),0.08)] text-[color:var(--bride-primary)]"
                          : "bg-[color:var(--bride-field-bg)] text-[color:var(--bride-text-muted)]"
                      }`}
                    >
                      {group.variants.length}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
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
        <div className="relative mt-3 flex items-center justify-between border-t border-[color:var(--bride-border-subtle)] px-1 pt-3">
          <div className="flex items-center gap-2 rounded-full border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-field-bg)] px-3 py-1.5 text-[11px] text-[color:var(--bride-text-muted)]">
            <Hexagon size={11} className="text-[color:var(--bride-text-muted)]" />
            <span>v2.5.0</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[rgba(var(--bride-primary-rgb),0.12)] bg-[rgba(var(--bride-primary-rgb),0.06)] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--bride-primary)] shadow-[0_0_4px_rgba(var(--bride-primary-rgb),0.45)]" />
            <span className="text-[9px] font-bold tracking-[0.08em] text-[color:var(--bride-primary)]">
              LIVE
            </span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
