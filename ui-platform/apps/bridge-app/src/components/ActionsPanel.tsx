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
    return <p className="px-2 py-4 text-xs text-slate-500">No actions logged yet.</p>;
  }

  return (
    <div className="space-y-1 p-2">
      {logs.map((entry) => (
        <div key={entry.id} className="rounded border border-slate-200 bg-white px-2 py-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-medium">{entry.name}</span>
            <span className="text-slate-400">{entry.time}</span>
          </div>
          <p className="mt-1 text-slate-500">{entry.payload}</p>
        </div>
      ))}
    </div>
  );
}

