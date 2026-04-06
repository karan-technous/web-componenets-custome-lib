import { useEffect, useState } from "react";
import { BottomPanel, type BottomTab } from "./components/BottomPanel";
import type { ActionLogEntry } from "./components/ActionsPanel";
import { PreviewCanvas } from "./components/PreviewCanvas";
import { Sidebar } from "./components/Sidebar";
import { Toolbar } from "./components/Toolbar";
import {
  getFramework,
  setFramework,
  type Framework,
} from "./state/frameworkStore";
import {
  getInitialSelectedStory,
  resolveStorySelection,
  storyCatalog,
  type SelectedStory,
} from "./state/storyStore";
import { applyTheme } from "./theme/themeManager";

export default function App() {
  const [framework, setFrameworkState] = useState<Framework>(getFramework());
  const [selection, setSelection] = useState<SelectedStory | null>(
    getInitialSelectedStory(),
  );
  const [activeTab, setActiveTab] = useState<BottomTab>("controls");
  const [showPanel, setShowPanel] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [refreshToken, setRefreshToken] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");
  const [actionLogs, setActionLogs] = useState<ActionLogEntry[]>([]);

  useEffect(() => {
    applyTheme(framework);
  }, [framework]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "p") {
        setShowPanel((prev) => !prev);
      }

      if (event.ctrlKey || event.metaKey) {
        if (event.key === "+" || event.key === "=") {
          event.preventDefault();
          setZoom((value) => Math.min(5, Number((value + 0.1).toFixed(2))));
        }

        if (event.key === "-") {
          event.preventDefault();
          setZoom((value) => Math.max(0.5, Number((value - 0.1).toFixed(2))));
        }

        if (event.key === "0") {
          event.preventDefault();
          setZoom(1);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleFrameworkChange = (value: Framework) => {
    setFramework(value);
    setFrameworkState(value);
    setRefreshToken((token) => token + 1);
    addAction("onFrameworkChange", value);
  };

  const handleStorySelect = (componentTitle: string, storyName: string) => {
    const next = resolveStorySelection(componentTitle, storyName);
    setSelection(next);
    addAction("onClick", `${componentTitle}/${storyName}`);
  };

  const handlePropChange = (key: string, value: string | boolean) => {
    setSelection((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        props: {
          ...current.props,
          [key]: value,
        },
      };
    });
    addAction(`onChange:${key}`, String(value));
  };

  const addAction = (name: string, payload: string) => {
    const entry: ActionLogEntry = {
      id: Date.now() + Math.floor(Math.random() * 100),
      name,
      payload,
      time: new Date().toLocaleTimeString(),
    };

    setActionLogs((logs) => [entry, ...logs].slice(0, 20));
  };

  const handleZoomIn = () => {
    setZoom((value) => Math.min(5, Number((value + 0.1).toFixed(2))));
    addAction("onZoomIn", "Preview zoom increased");
  };

  const handleZoomOut = () => {
    setZoom((value) => Math.max(0.5, Number((value - 0.1).toFixed(2))));
    addAction("onZoomOut", "Preview zoom decreased");
  };

  const handleResetZoom = () => {
    setZoom(1);
    addAction("onResetZoom", "Preview zoom reset");
  };

  const handleRefresh = () => {
    setRefreshToken((token) => token + 1);
    addAction("onRefresh", "Preview refreshed");
  };

  const handleOpenNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank", "noopener,noreferrer");
      addAction("onOpen", currentUrl);
    }
  };

  return (
    <main className="h-screen overflow-hidden">
      <div className="grid h-full grid-cols-[240px_1fr]">
        <Sidebar
          stories={storyCatalog}
          framework={framework}
          selectedComponent={selection?.componentTitle ?? ""}
          selectedStory={selection?.storyName ?? ""}
          onFrameworkChange={handleFrameworkChange}
          onSelectStory={handleStorySelect}
        />

        <div className="flex min-h-0 flex-col gap-2 p-2">
          <Toolbar
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            onRefresh={handleRefresh}
            onOpenNewTab={handleOpenNewTab}
            showPanel={showPanel}
            onTogglePanel={() => setShowPanel((prev) => !prev)}
          />
          <div className="relative min-h-0 flex-1">
            <PreviewCanvas
              framework={framework}
              selection={selection}
              zoom={zoom}
              refreshToken={refreshToken}
              onCurrentUrlChange={setCurrentUrl}
            />
            <BottomPanel
              show={showPanel}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              propsValue={selection?.props ?? {}}
              onPropChange={handlePropChange}
              actionLogs={actionLogs}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
