import { motion } from "framer-motion";
import {
  ExternalLink,
  PanelBottom,
  RefreshCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { ReactNode } from "react";

interface ToolbarProps {
  zoom: number;
  mode: "preview" | "docs";
  onModeChange: (mode: "preview" | "docs") => void;
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
      className="bridge-btn secondary icon-button rounded-md p-1.5 transition"
      title={label}
      aria-label={label}
    >
      {children}
    </motion.button>
  );
}

export function Toolbar({
  zoom,
  mode,
  onModeChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onRefresh,
  onOpenNewTab,
  showPanel,
  onTogglePanel,
}: ToolbarProps) {
  return (
    <div className="glass navbar flex items-center justify-between px-2 py-1">
      <div className="flex items-center gap-2">
        <div className="glass flex gap-2 rounded-md p-0.5 text-xs">
          <button
            onClick={() => onModeChange("preview")}
            className={`tab ${mode === "preview" ? "active font-semibold" : ""}`}
          >
            Preview
          </button>
          <button
            onClick={() => onModeChange("docs")}
            className={`tab ${mode === "docs" ? "active font-semibold" : ""}`}
          >
            Docs
          </button>
        </div>
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
              className={showPanel ? "text-primary" : ""}
            />
          </ToolButton>
        </div>
      </div>
      <span className="text-secondary text-xs">{Math.round(zoom * 100)}%</span>
    </div>
  );
}
