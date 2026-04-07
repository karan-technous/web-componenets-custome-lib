import { AnimatePresence, motion } from "framer-motion";
import {
  Atom,
  Boxes,
  ChevronDown,
  ChevronRight,
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

  const frameworkOptions: Array<{
    value: Framework;
    label: string;
    icon: typeof Atom;
  }> = [
    { value: "angular", label: "Angular", icon: Triangle },
    { value: "react", label: "React", icon: Atom },
    { value: "wc", label: "Web Components", icon: Boxes },
  ];

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
      transition={{ duration: 0.15 }}
      className="sidebar glass-without-border-radius glass sticky top-0 overflow-hidden"
    >
      <div className="mb-1 px-1">
        <h2 className="text-sm font-semibold text-primary">UI Platform</h2>
      </div>

      <div className="relative mb-1">
        <Search
          size={13}
          className="text-secondary pointer-events-none absolute left-2 top-[10px] z-10"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find by name"
          className="sidebar-search surface-input w-full rounded-md text-sm outline-none focus:ring-2 focus:ring-[color:var(--bridge-ui-ring)]"
        />
      </div>

      <div className="mb-1 grid grid-cols-1 gap-1">
        {frameworkOptions.map((item) => {
          const Icon = item.icon;
          const active = framework === item.value;
          return (
            <motion.button
              key={item.value}
              whileHover={{ x: 1 }}
              transition={{ duration: 0.15 }}
              onClick={() => onFrameworkChange(item.value)}
              className={`framework-item text-sm ${active ? "active font-semibold" : ""}`}
            >
              <Icon size={13} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
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
            <div key={group.definition.id} className="component-card">
              <button
                onClick={() => toggleGroup(group.definition.id)}
                className={`component-header ${isActiveGroup ? "active" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <Boxes
                    size={13}
                    className={
                      isActiveGroup ? "text-primary" : "text-secondary"
                    }
                  />
                  <span
                    className={`text-xs ${isActiveGroup ? "text-primary font-semibold" : "text-secondary"}`}
                  >
                    {group.definition.title}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronDown size={14} className="text-secondary" />
                ) : (
                  <ChevronRight size={14} className="text-secondary" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden px-0.5 pb-0.5"
                  >
                    <div className="story-list border-l border-[color:var(--bridge-border)] pl-1.5">
                      {filteredStories.map((story) => {
                        const active =
                          selectedStoryId === group.definition.id &&
                          selectedStory === story.name;
                        return (
                          <motion.button
                            key={story.name}
                            whileHover={{ x: 2 }}
                            onClick={() =>
                              onSelectStory(group.definition.id, story.name)
                            }
                            className={`story-item w-full text-left text-sm ${active ? "active font-medium" : ""}`}
                          >
                            {story.name}
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
    </motion.aside>
  );
}
