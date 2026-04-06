import { useEffect, useRef, useState } from 'react';
import type { StoryProps } from '../state/storyStore';

interface ControlsTableProps {
  propsValue: StoryProps;
  onPropChange: (key: string, value: string | boolean) => void;
}

const variantOptions = ['primary', 'secondary', 'outline', 'ghost'];

function describeProp(key: string): string {
  const normalized = key.toLowerCase();
  if (normalized === 'variant') return 'Visual variant';
  if (normalized === 'label') return 'Text label';
  if (normalized === 'disabled') return 'Disable flag';
  if (normalized === 'placeholder') return 'Placeholder text';
  if (normalized === 'value') return 'Current value';
  return 'Story prop';
}

function inferControlType(key: string, value: string | boolean): 'text' | 'select' | 'boolean' {
  if (typeof value === 'boolean') return 'boolean';
  if (key.toLowerCase() === 'variant') return 'select';
  return 'text';
}

export function ControlsTable({ propsValue, onPropChange }: ControlsTableProps) {
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

  const entries = Object.entries(draftProps);

  if (entries.length === 0) {
    return <p className="px-2 py-4 text-xs text-slate-500">No controls available for this story.</p>;
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <div className="grid grid-cols-[1fr_1.2fr_1.2fr] bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <span>Name</span>
        <span>Description</span>
        <span>Control</span>
      </div>
      <div>
        {entries.map(([key, value]) => {
          const controlType = inferControlType(key, value);
          return (
            <div key={key} className="grid grid-cols-[1fr_1.2fr_1.2fr] items-center border-t border-slate-100 px-2 py-1.5">
              <span className="text-xs font-medium capitalize text-slate-800">{key}</span>
              <span className="text-xs text-slate-500">{describeProp(key)}</span>
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
                    className="w-full rounded border border-slate-200 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-[color:var(--bridge-ui-ring)]"
                  >
                    {variantOptions.map((option) => (
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
                    className="w-full rounded border border-slate-200 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-[color:var(--bridge-ui-ring)]"
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
