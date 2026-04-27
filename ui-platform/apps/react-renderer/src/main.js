import { jsx as _jsx } from "react/jsx-runtime";
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as ReactWrappers from '@karan9186/react';
import { ToastProvider } from '@karan9186/react';
import { applyTheme, lightTheme, darkTheme } from '@karan9186/core';
import * as esbuild from 'esbuild-wasm';
import esbuildWasmUrl from 'esbuild-wasm/esbuild.wasm?url';
import './theme.css';
// Apply core theme based on appearance from URL
const params = new URLSearchParams(window.location.search);
const appearance = params.get('appearance') === 'light' ? 'light' : 'dark';
const coreTheme = appearance === 'light' ? lightTheme : darkTheme;
try {
    applyTheme(coreTheme);
}
catch (error) {
    console.error('Failed to apply initial theme:', error);
}
const rootStyle = document.documentElement.style;
rootStyle.setProperty('--bridge-ui-primary', '#3b82f6');
rootStyle.setProperty('--bridge-ui-bg', appearance === 'light' ? '#ffffff' : '#0b1020');
rootStyle.setProperty('--bridge-ui-surface', appearance === 'light' ? '#ffffff' : '#12182a');
rootStyle.setProperty('--bridge-ui-ring', 'rgba(59, 130, 246, 0.3)');
window.BridgeReact = React;
window.BridgeReactWrappers = {
    ...ReactWrappers,
    noop: () => { },
};
await esbuild.initialize({
    wasmURL: esbuildWasmUrl,
});
const container = document.getElementById('root');
if (!container) {
    throw new Error('Missing #root element');
}
const root = createRoot(container);
let runtimeState = {
    component: null,
    error: null,
};
let currentModuleUrl = null;
function renderRuntime() {
    const StoryComponent = runtimeState.component;
    root.render(_jsx(StrictMode, { children: _jsx(ToastProvider, { children: _jsx("main", { className: "page", children: _jsx("section", { className: "canvas", children: _jsx("div", { className: "controls", children: runtimeState.error ? (_jsx("div", { className: "text-sm text-rose-400 whitespace-pre-wrap", children: runtimeState.error })) : StoryComponent ? (_jsx(StoryComponent, {})) : null }) }) }) }) }));
}
// Listen for theme changes from parent
window.addEventListener('message', (event) => {
    try {
        if (event.data?.type === 'UPDATE_THEME') {
            const newAppearance = event.data.appearance === 'light' ? 'light' : 'dark';
            const newTheme = newAppearance === 'light' ? lightTheme : darkTheme;
            applyTheme(newTheme);
            rootStyle.setProperty('--bridge-ui-bg', newAppearance === 'light' ? '#ffffff' : '#0b1020');
            rootStyle.setProperty('--bridge-ui-surface', newAppearance === 'light' ? '#ffffff' : '#12182a');
            return;
        }
        if (event.data?.type !== 'RUN_STORY') {
            return;
        }
        const payload = event.data.payload;
        if (!payload || payload.framework !== 'react') {
            return;
        }
        void (async () => {
            try {
                const result = await esbuild.transform(payload.code, {
                    loader: 'tsx',
                    format: 'esm',
                    jsxFactory: 'BridgeReact.createElement',
                    jsxFragment: 'BridgeReact.Fragment',
                    target: 'es2020',
                });
                if (currentModuleUrl) {
                    URL.revokeObjectURL(currentModuleUrl);
                }
                currentModuleUrl = URL.createObjectURL(new Blob([result.code], { type: 'text/javascript' }));
                const mod = await import(/* @vite-ignore */ currentModuleUrl);
                runtimeState = {
                    component: mod.default ?? null,
                    error: null,
                };
            }
            catch (error) {
                runtimeState = {
                    component: null,
                    error: error instanceof Error ? error.message : 'Failed to compile story.',
                };
            }
            renderRuntime();
        })();
    }
    catch (error) {
        console.error('Failed to handle theme update:', error);
    }
});
renderRuntime();
window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
