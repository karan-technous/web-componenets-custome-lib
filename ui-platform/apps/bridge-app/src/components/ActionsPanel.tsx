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
    return <p className="text-secondary px-2 py-4 text-xs">No actions logged yet.</p>;
  }

  return (
    <div className="space-y-1 p-2">
      {logs.map((entry) => (
        <div key={entry.id} className="card rounded px-2 py-1.5 text-xs">
          <div className="text-primary flex items-center justify-between">
            <span className="font-medium">{entry.name}</span>
            <span className="text-muted">{entry.time}</span>
          </div>
          <p className="text-secondary mt-1">{entry.payload}</p>
        </div>
      ))}
    </div>
  );
}

