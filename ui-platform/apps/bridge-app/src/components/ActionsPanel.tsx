export interface ActionLogEntry {
  id: number;
  name: string;
  payload: string;
  time: string;
}

interface ActionsPanelProps {
  logs: ActionLogEntry[];
}

export function ActionsPanel({ logs }: ActionsPanelProps) {
  if (logs.length === 0) {
    return (
      <p className="text-xs text-[color:var(--bride-text-soft)]">
        No actions logged yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((entry) => (
        <div
          key={entry.id}
          className="rounded-xl border border-[color:var(--bride-border-subtle)] bg-[var(--bride-glass-surface)] px-4 py-3 text-xs shadow-[inset_0_1px_0_var(--bride-border-subtle)] backdrop-blur-[12px]"
        >
          <div className="flex items-center justify-between text-[color:var(--docs-accent-strong)]">
            <span className="font-medium">{entry.name}</span>
            <span className="text-[color:var(--bride-text-muted)]">{entry.time}</span>
          </div>
          <p className="mt-1 text-[color:var(--bride-text-soft)]">{entry.payload}</p>
        </div>
      ))}
    </div>
  );
}
