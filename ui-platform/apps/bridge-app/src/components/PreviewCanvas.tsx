import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Framework } from "../state/frameworkStore";
import type { SelectedStory, StoryRendererBindings } from "../state/storyTypes";

interface PreviewCanvasProps {
  framework: Framework;
  selection: SelectedStory | null;
  zoom: number;
  refreshToken: number;
  onCurrentUrlChange: (url: string) => void;
}

const rendererUrls: Record<Framework, string> = {
  angular: "http://localhost:4200",
  react: "http://localhost:5173",
  wc: "http://localhost:5174",
};

function buildPreviewUrl(framework: Framework, refreshToken: number) {
  const params = new URLSearchParams({
    refresh: String(refreshToken),
  });

  return `${rendererUrls[framework]}?${params.toString()}`;
}

function buildShareUrl(framework: Framework, selection: SelectedStory) {
  const params = new URLSearchParams({
    component: selection.component,
    story: selection.storyName,
    props: JSON.stringify(selection.props),
    renderers: JSON.stringify(selection.renderers ?? {}),
  });

  return `${rendererUrls[framework]}?${params.toString()}`;
}

function sendToPreview(
  iframe: HTMLIFrameElement | null,
  payload: {
    framework: Framework;
    component: string;
    story: string;
    props: Record<string, string | boolean>;
    renderers?: StoryRendererBindings;
  },
) {
  if (!iframe?.contentWindow) {
    return;
  }

  iframe.contentWindow.postMessage(
    {
      type: "UPDATE_STORY",
      payload,
    },
    "*",
  );
}

export function PreviewCanvas({
  framework,
  selection,
  zoom,
  refreshToken,
  onCurrentUrlChange,
}: PreviewCanvasProps) {
  const src = useMemo(
    () => buildPreviewUrl(framework, refreshToken),
    [framework, refreshToken],
  );
  const shareUrl = useMemo(
    () =>
      selection
        ? buildShareUrl(framework, selection)
        : buildPreviewUrl(framework, refreshToken),
    [framework, refreshToken, selection],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const previousSrcRef = useRef(src);
  const pendingPayloadRef = useRef<{
    framework: Framework;
    component: string;
    story: string;
    props: Record<string, string | boolean>;
    renderers?: StoryRendererBindings;
  } | null>(null);

  useEffect(() => {
    if (src !== previousSrcRef.current) {
      setIsLoading(true);
      setIsReady(false);
      previousSrcRef.current = src;
    }
  }, [src]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== "IFRAME_READY") {
        return;
      }

      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      setIsReady(true);
      setIsLoading(false);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    onCurrentUrlChange(shareUrl);
  }, [onCurrentUrlChange, shareUrl]);

  useEffect(() => {
    if (!selection) {
      pendingPayloadRef.current = null;
      return;
    }

    const payload = {
      framework,
      component: selection.component,
      story: selection.storyName,
      props: selection.props,
      renderers: selection.renderers,
    };

    pendingPayloadRef.current = payload;
    if (!isReady) {
      return;
    }

    const timeout = window.setTimeout(() => {
      sendToPreview(iframeRef.current, payload);
    }, 60);

    return () => window.clearTimeout(timeout);
  }, [framework, isReady, selection]);

  useEffect(() => {
    if (!isReady || !pendingPayloadRef.current) {
      return;
    }

    sendToPreview(iframeRef.current, pendingPayloadRef.current);
  }, [isReady]);

  if (!selection) {
    return (
      <section className="flex min-h-0 flex-1 items-center justify-center bg-[var(--bride-glass-dark)]">
        <div className="text-center">
          <p className="text-sm font-medium text-[color:var(--bride-text)]">
            No story selected
          </p>
          <p className="mt-1 text-xs text-[color:var(--bride-text-soft)]">
            Select a story from the explorer.
          </p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      key={`${framework}-${refreshToken}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[var(--bride-glass-dark)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 180px, var(--docs-accent-glow), transparent 40%)",
        }}
      />
      <div className="relative h-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            background:
              "radial-gradient(circle at 50% 180px, var(--docs-accent-glow), transparent 52%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at calc(50% + 180px) 96px, var(--docs-accent-surface), transparent 44%)",
          }}
        />

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-6 z-20 flex items-center justify-center rounded-xl border border-[color:var(--bride-border-subtle)] bg-[var(--bride-glass-dark)] shadow-[inset_0_1px_0_var(--bride-border-subtle)] backdrop-blur-[18px]"
            >
              <span className="text-xs text-[color:var(--bride-text-soft)]">
                Loading preview...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden bg-[var(--bride-glass-dark)] shadow-[inset_0_1px_0_var(--bride-border-subtle)] p-7">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--bride-border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--bride-border-subtle)_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
          <div
            className="relative h-full w-full overflow-hidden"
            style={{ transition: "width 150ms ease, height 150ms ease" }}
          >
            <iframe
              id="preview-iframe"
              ref={iframeRef}
              title="renderer-preview"
              src={src}
              onLoad={() => {
                // Waiting for explicit renderer handshake.
              }}
              className="h-full w-full border-0 opacity-[0.98]"
              style={{
                zoom: zoom,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: `${100 / zoom}%`,
                height: `${100 / zoom}%`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
