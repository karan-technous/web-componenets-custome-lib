import { AnimatePresence, motion } from 'framer-motion';
import { Atom, Boxes, ChevronDown, ChevronRight, Search, Triangle } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Framework } from '../state/frameworkStore';
import type { StoryEntry } from '../state/storyTypes';

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
  onSelectStory
}: SidebarProps) {
  const initialGroups = useMemo(
    () =>
      stories.reduce<Record<string, boolean>>((acc, group) => {
        acc[group.definition.id] = true;
        return acc;
      }, {}),
    [stories]
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialGroups);
  const [query, setQuery] = useState('');

  const frameworkOptions: Array<{ value: Framework; label: string; icon: typeof Atom }> = [
    { value: 'angular', label: 'Angular', icon: Triangle },
    { value: 'react', label: 'React', icon: Atom },
    { value: 'wc', label: 'Web Components', icon: Boxes }
  ];

  const toggleGroup = (title: string) => {
    setOpenGroups((current) => ({
      ...current,
      [title]: !current[title]
    }));
  };

  return (
    <motion.aside
      initial={{ x: -8, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="sticky top-0 h-screen w-[240px] overflow-hidden border-r border-slate-200 bg-[color:var(--bridge-ui-sidebar)]/96 p-2"
    >
      <div className="mb-2 px-1">
        <h2 className="text-sm font-semibold text-slate-800">UI Platform</h2>
      </div>

      <div className="relative mb-2">
        <Search size={13} className="pointer-events-none absolute left-2 top-2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find by name"
          className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-7 pr-2 text-xs outline-none focus:ring-2 focus:ring-[color:var(--bridge-ui-ring)]"
        />
      </div>

      <div className="mb-2 grid grid-cols-1 gap-1">
        {frameworkOptions.map((item) => {
          const Icon = item.icon;
          const active = framework === item.value;
          return (
            <motion.button
              key={item.value}
              whileHover={{ x: 1 }}
              transition={{ duration: 0.15 }}
              onClick={() => onFrameworkChange(item.value)}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition ${
                active ? 'font-semibold text-slate-900' : 'text-slate-600 hover:bg-white/70'
              }`}
              style={active ? { backgroundColor: 'color-mix(in srgb, var(--bridge-ui-primary) 14%, white)' } : undefined}
            >
              <Icon size={13} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="h-[calc(100vh-145px)] space-y-1 overflow-y-auto pr-1">
        {stories.map((group) => {
          const matchesGroup = group.definition.title.toLowerCase().includes(query.toLowerCase());
          const filteredStories = group.variants.filter((story) =>
            story.name.toLowerCase().includes(query.toLowerCase())
          );

          if (!matchesGroup && filteredStories.length === 0) {
            return null;
          }

          const isOpen = openGroups[group.definition.id] ?? true;
          const isActiveGroup = selectedStoryId === group.definition.id;

          return (
            <div key={group.definition.id} className="rounded-md border border-slate-200/70 bg-white/75">
              <button
                onClick={() => toggleGroup(group.definition.id)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-white"
              >
                <div className="flex items-center gap-2">
                  <Boxes size={13} className={isActiveGroup ? 'text-[color:var(--bridge-ui-primary)]' : 'text-slate-500'} />
                  <span className={`text-xs ${isActiveGroup ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                    {group.definition.title}
                  </span>
                </div>
                {isOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden px-1 pb-1"
                  >
                    <div className="space-y-0.5 border-l border-slate-200 pl-1.5">
                      {filteredStories.map((story) => {
                        const active = selectedStoryId === group.definition.id && selectedStory === story.name;
                        return (
                          <motion.button
                            key={story.name}
                            whileHover={{ x: 2 }}
                            onClick={() => onSelectStory(group.definition.id, story.name)}
                            className={`w-full rounded-md px-2 py-1 text-left text-xs transition ${
                              active
                                ? 'font-medium text-slate-900'
                                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                            }`}
                            style={active ? { backgroundColor: 'color-mix(in srgb, var(--bridge-ui-primary) 14%, white)' } : undefined}
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
