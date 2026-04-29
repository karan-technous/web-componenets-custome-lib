import React from "react";
import {
  CheckCircle,
  Layers,
  Image as ImageIcon,
  BookOpen,
  Image,
} from "lucide-react";

interface WelcomeScreenProps {
  onExplore?: () => void;
  onOpenDocs?: () => void;
  onRefresh?: () => void;
}

export function WelcomeScreen({
  onExplore,
  onOpenDocs,
  onRefresh,
}: WelcomeScreenProps) {
  return (
    <section
      className="flex min-h-0 flex-1 items-center justify-center bg-[var(--bride-glass-dark)] p-6"
      style={{ background: "#F7F9FF" }}
    >
      <div className="max-w-2xl text-center">
        <div className="flex items-center justify-center">
          {/* <img src="/one-box-ui-logo-transparent.png" height={300} width={300} alt="logo" /> */}
          <div style={{ height: "200px", width: "300px", overflow: "hidden" }}>
            <video
              autoPlay
              muted
              loop
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src="/logo_video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* <p className="mt-2 text-sm text-[color:var(--bride-text-soft)]">
          Select a component from the sidebar to begin. The preview will render
          only after you choose a story.
        </p> */}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-lg border bg-[var(--bride-field-bg)] p-3">
            <CheckCircle size={20} />
            <div className="text-sm font-medium">Interactive Preview</div>
            <div className="text-xs text-[color:var(--bride-text-soft)]">
              Render components in real-time
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border bg-[var(--bride-field-bg)] p-3">
            <Layers size={20} />
            <div className="text-sm font-medium">Design Tokens</div>
            <div className="text-xs text-[color:var(--bride-text-soft)]">
              Theme-aware previews and configs
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border bg-[var(--bride-field-bg)] p-3">
            <BookOpen size={20} />
            <div className="text-sm font-medium">Docs & Examples</div>
            <div className="text-xs text-[color:var(--bride-text-soft)]">
              Open stories and usage docs
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => onExplore?.()}
            className="rounded-md border px-4 py-2 text-sm bg-[var(--bride-primary)] text-white"
          >
            Explore components
          </button>
        </div>
      </div>
    </section>
  );
}

export default WelcomeScreen;
