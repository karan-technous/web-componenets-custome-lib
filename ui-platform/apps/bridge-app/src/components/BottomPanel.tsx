import { AnimatePresence, motion } from 'framer-motion';
import { ActionsPanel, type ActionLogEntry } from './ActionsPanel';
import { ControlsTable } from './ControlsTable';
import type { PropConfig, StoryProps } from '../state/storyTypes';

export type BottomTab = 'controls' | 'actions' | 'interactions';

interface BottomPanelProps {
  show: boolean;
  activeTab: BottomTab;
  propsValue: StoryProps;
  propsConfig: Record<string, PropConfig>;
  actionLogs: ActionLogEntry[];
  onTabChange: (tab: BottomTab) => void;
  onPropChange: (key: string, value: string | boolean) => void;
}

const tabs: Array<{ id: BottomTab; label: string }> = [
  { id: 'controls', label: 'Controls' },
  { id: 'actions', label: 'Actions' },
  { id: 'interactions', label: 'Interactions' }
];

export function BottomPanel({ show, activeTab, propsValue, propsConfig, actionLogs, onTabChange, onPropChange }: BottomPanelProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.section
          initial={{ y: 220, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 220, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-0 left-0 right-0 z-20 h-[32%] rounded-t-md border border-slate-200 bg-[color:var(--bridge-ui-surface)] shadow-sm"
        >
          <div className="flex items-center gap-1 border-b border-slate-200 px-2 py-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`rounded px-2 py-1 text-xs transition ${
                    active ? 'font-semibold text-slate-900' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                  style={active ? { backgroundColor: 'color-mix(in srgb, var(--bridge-ui-primary) 14%, white)' } : undefined}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="h-[calc(100%-33px)] overflow-auto">
            {activeTab === 'controls' && <ControlsTable propsValue={propsValue} propsConfig={propsConfig} onPropChange={onPropChange} />}
            {activeTab === 'actions' && <ActionsPanel logs={actionLogs} />}
            {activeTab === 'interactions' && (
              <p className="px-2 py-4 text-xs text-slate-500">No interactions defined</p>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
