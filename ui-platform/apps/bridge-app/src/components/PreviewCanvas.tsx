import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
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

  console.log("Sending ->", payload);
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
    // Only show loading overlay when iframe src actually changes.
    // Control/story updates are message-based and should not force spinner.
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

      console.log("Bridge <- IFRAME_READY");
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
      <section className="preview flex min-h-0 flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-primary text-sm font-medium">
            No story selected
          </p>
          <p className="text-secondary mt-1 text-xs">
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
      transition={{ duration: 0.15 }}
      className="preview flex h-full min-h-0 flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] px-2 py-1">
        <p className="text-secondary text-xs">
          {selection.componentTitle} /{" "}
          <span className="text-primary">{selection.storyName}</span>
        </p>
        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="sidebar-item inline-flex items-center gap-1 px-1.5 py-1 text-xs"
        >
          <ExternalLink size={12} />
          Open
        </a>
      </div>

      <div className="relative h-full overflow-hidden p-3">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="glass absolute inset-3 z-10 flex items-center justify-center"
            >
              <span className="text-secondary text-xs">Loading preview...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex h-full w-full items-center justify-center overflow-hidden">
          <div
            className={`card overflow-hidden w-full h-full`}
            style={{
              transition: "width 150ms ease, height 150ms ease",
            }}
          >
            <iframe
              id="preview-iframe"
              ref={iframeRef}
              title="renderer-preview"
              src={src}
              onLoad={() => {
                // Waiting for explicit renderer handshake.
              }}
              className="h-full w-full border-0"
              style={{
                // Browser-like zoom behavior (Chrome supports CSS zoom).
                // Fallback transform keeps parity in engines without zoom.
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
