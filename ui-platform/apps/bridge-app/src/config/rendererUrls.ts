import type { Framework } from "../state/frameworkStore";

export const rendererUrls: Record<Framework, string> = {
  angular:
    import.meta.env.VITE_ANGULAR_RENDERER_URL ?? "http://localhost:4200",
  react: import.meta.env.VITE_REACT_RENDERER_URL ?? "http://localhost:5173",
  wc: import.meta.env.VITE_WC_RENDERER_URL ?? "http://localhost:5174",
};
