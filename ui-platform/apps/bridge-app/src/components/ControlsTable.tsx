import { useEffect, useRef, useState } from 'react';
import type { PropConfig, StoryProps } from '../state/storyTypes';

interface ControlsTableProps {
  propsValue: StoryProps;
  propsConfig: Record<string, PropConfig>;
  onPropChange: (key: string, value: string | boolean) => void;
}

function mapControlType(type: PropConfig["type"]): 'text' | 'select' | 'boolean' {
  if (type === 'boolean') return 'boolean';
  if (type === 'select') return 'select';
  return 'text';
}

export function ControlsTable({ propsValue, propsConfig, onPropChange }: ControlsTableProps) {
  const [draftProps, setDraftProps] = useState<StoryProps>(propsValue);
  const timersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    setDraftProps(propsValue);
  }, [propsValue]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timerId) => window.clearTimeout(timerId));
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
    return <p className="text-secondary px-2 py-4 text-xs">No controls available for this story.</p>;
  }

  return (
    <div className="card overflow-hidden rounded-md">
      <div className="text-secondary grid grid-cols-[1fr_1.2fr_1.2fr] bg-[color:var(--hover-bg)] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide">
        <span>Name</span>
        <span>Description</span>
        <span>Control</span>
      </div>
      <div>
        {entries.map(([key, config]) => {
          const value = draftProps[key] ?? config.default;
          const controlType = mapControlType(config.type);
          const options = config.options ?? [];
          return (
            <div key={key} className="grid grid-cols-[1fr_1.2fr_1.2fr] items-center border-t border-[color:var(--border-subtle)] px-2 py-1.5">
              <span className="text-primary text-xs font-medium capitalize">{key}</span>
              <span className="text-secondary text-xs">{config.description ?? 'Story prop'}</span>
              <div>
                {controlType === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => {
                      const nextValue = event.target.checked;
                      setDraftProps((current) => ({ ...current, [key]: nextValue }));
                      commitChange(key, nextValue);
                    }}
                    className="h-4 w-4 rounded accent-[color:var(--bridge-ui-primary)]"
                  />
                ) : controlType === 'select' ? (
                  <select
                    value={String(value)}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setDraftProps((current) => ({ ...current, [key]: nextValue }));
                      commitChange(key, nextValue);
                    }}
                    className="surface-input w-full rounded px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-[color:var(--bridge-ui-ring)]"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={String(value)}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setDraftProps((current) => ({ ...current, [key]: nextValue }));
                      commitChange(key, nextValue);
                    }}
                    className="surface-input w-full rounded px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-[color:var(--bridge-ui-ring)]"
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
