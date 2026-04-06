import { motion } from "framer-motion";
import {
  ExternalLink,
  PanelBottom,
  RefreshCw,
  RotateCcw,
  Smartphone,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { ReactNode } from "react";

interface ToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onRefresh: () => void;
  onOpenNewTab: () => void;
  showPanel: boolean;
  onTogglePanel: () => void;
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className="rounded-md border border-transparent p-1.5 text-slate-600 transition hover:border-slate-200 hover:bg-white hover:text-slate-900"
      title={label}
      aria-label={label}
    >
      {children}
    </motion.button>
  );
}

export function Toolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onRefresh,
  onOpenNewTab,
  showPanel,
  onTogglePanel,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-slate-200 bg-[color:var(--bridge-ui-surface)] px-2 py-1 shadow-sm">
      <div className="flex items-center gap-1">
        <ToolButton label="Zoom in" onClick={onZoomIn}>
          <ZoomIn size={14} />
        </ToolButton>
        <ToolButton label="Zoom out" onClick={onZoomOut}>
          <ZoomOut size={14} />
        </ToolButton>
        <ToolButton label="Reset zoom" onClick={onResetZoom}>
          <RotateCcw size={14} />
        </ToolButton>
        <ToolButton label="Refresh preview" onClick={onRefresh}>
          <RefreshCw size={14} />
        </ToolButton>
        <ToolButton label="Open in new tab" onClick={onOpenNewTab}>
          <ExternalLink size={14} />
        </ToolButton>
        <ToolButton label="Toggle Panel" onClick={onTogglePanel}>
          <PanelBottom
            size={14}
            className={showPanel ? "text-[color:var(--bridge-ui-primary)]" : ""}
          />
        </ToolButton>
      </div>
      <span className="text-xs text-slate-500">{Math.round(zoom * 100)}%</span>
    </div>
  );
}
