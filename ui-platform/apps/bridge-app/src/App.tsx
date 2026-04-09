import { useEffect, useState } from "react";
import { BottomPanel, type BottomTab } from "./components/BottomPanel";
import type { ActionLogEntry } from "./components/ActionsPanel";
import { PreviewCanvas } from "./components/PreviewCanvas";
import { Sidebar } from "./components/Sidebar";
import { Toolbar } from "./components/Toolbar";
import { DocsPage } from "./docs/DocsPage";
import {
  getFramework,
  setFramework,
  type Framework,
} from "./state/frameworkStore";
import {
  getInitialSelectedStory,
  getStoriesForFramework,
  resolveStorySelection,
} from "./state/storyStore";
import type { SelectedStory } from "./state/storyTypes";
import {
  applyTheme,
  getAppearance,
  setAppearance,
  type AppearanceMode,
} from "./theme/themeManager";

export default function App() {
  const [framework, setFrameworkState] = useState<Framework>(getFramework());
  const filteredStories = getStoriesForFramework(framework);
  const [selection, setSelection] = useState<SelectedStory | null>(
    getInitialSelectedStory(framework),
  );
  const [activeTab, setActiveTab] = useState<BottomTab>("controls");
  const [mode, setMode] = useState<"preview" | "docs">("preview");
  const [appearance, setAppearanceState] =
    useState<AppearanceMode>(getAppearance());
  const [showPanel, setShowPanel] = useState(true);
  const [panelHeight, setPanelHeight] = useState(300);
  const [zoom, setZoom] = useState(1);
  const [refreshToken, setRefreshToken] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");
  const [actionLogs, setActionLogs] = useState<ActionLogEntry[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    applyTheme(framework, appearance);
  }, [framework, appearance]);

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
    setSelection((current) => {
      if (current && current.framework.includes(value)) {
        return current;
      }
      return getInitialSelectedStory(value);
    });
    addAction("onFrameworkChange", value);
  };

  const handleStorySelect = (storyId: string, storyName: string) => {
    const next = resolveStorySelection(storyId, storyName);
    setSelection(next);
    addAction("onClick", `${storyId}/${storyName}`);
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

  const handleAppearanceChange = (value: AppearanceMode) => {
    setAppearance(value);
    setAppearanceState(value);
    addAction("onAppearanceChange", value);
  };

  return (
    <main className="h-screen overflow-hidden">
      <div
        className="grid h-full transition-[grid-template-columns] duration-300 ease-out"
        style={{
          gridTemplateColumns: isSidebarCollapsed ? "88px 1fr" : "256px 1fr",
        }}
      >
        <Sidebar
          stories={filteredStories}
          framework={framework}
          selectedStoryId={selection?.storyId ?? ""}
          selectedStory={selection?.storyName ?? ""}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() =>
            setIsSidebarCollapsed((collapsed) => !collapsed)
          }
          onFrameworkChange={handleFrameworkChange}
          onSelectStory={handleStorySelect}
        />

        <div className="relative z-10 flex min-h-0 flex-col overflow-hidden bg-[color:var(--bride-bg)]">
          <Toolbar
            framework={framework}
            selection={selection}
            currentUrl={currentUrl}
            appearance={appearance}
            onFrameworkChange={handleFrameworkChange}
            onAppearanceChange={handleAppearanceChange}
            zoom={zoom}
            mode={mode}
            onModeChange={setMode}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            onRefresh={handleRefresh}
            onOpenNewTab={handleOpenNewTab}
            showPanel={showPanel}
            onTogglePanel={() => setShowPanel((prev) => !prev)}
          />

          <div className="relative min-h-0 flex-1 overflow-hidden">
            {mode === "preview" ? (
              <div className="flex h-full min-h-0 flex-col">
                <div className="min-h-0 flex-1">
                  <PreviewCanvas
                    framework={framework}
                    selection={selection}
                    zoom={zoom}
                    refreshToken={refreshToken}
                    onCurrentUrlChange={setCurrentUrl}
                  />
                </div>
                <BottomPanel
                  show={showPanel}
                  height={panelHeight}
                  onHeightChange={setPanelHeight}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  propsValue={selection?.props ?? {}}
                  propsConfig={selection?.propsConfig ?? {}}
                  onPropChange={handlePropChange}
                  actionLogs={actionLogs}
                />
              </div>
            ) : (
              <DocsPage
                framework={framework}
                story={selection}
                onOpenStory={(storyName) => {
                  handleStorySelect(selection?.storyId ?? "", storyName);
                  setMode("preview");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
