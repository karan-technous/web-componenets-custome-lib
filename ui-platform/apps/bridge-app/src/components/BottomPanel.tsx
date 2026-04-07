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
          className="preview absolute bottom-0 left-0 right-0 z-20 h-[32%] rounded-t-md"
        >
          <div className="flex items-center gap-1 border-b border-[color:var(--border-subtle)] px-2 py-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`tab text-xs ${active ? 'active font-semibold' : ''}`}
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
              <p className="text-secondary px-2 py-4 text-xs">No interactions defined</p>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
