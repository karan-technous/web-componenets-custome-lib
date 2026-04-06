import './theme.css';
import { defineCustomElements } from '@karan9186/web-components/loader';
defineCustomElements();
const root = document.getElementById('app');
if (!root) {
    throw new Error('Missing #app root');
}
document.documentElement.style.height = '100%';
document.documentElement.style.setProperty('--bridge-ui-primary', '#111827');
document.documentElement.style.setProperty('--bridge-ui-bg', '#f9fafb');
document.documentElement.style.setProperty('--bridge-ui-surface', '#ffffff');
document.documentElement.style.setProperty('--bridge-ui-ring', 'rgba(17, 24, 39, 0.3)');
document.body.style.height = '100%';
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
root.style.height = '100%';
root.style.width = '100%';
root.style.overflow = 'hidden';
const page = document.createElement('main');
page.className = 'page';
const canvas = document.createElement('section');
canvas.className = 'canvas';
const controls = document.createElement('div');
controls.className = 'controls';
function applyProps(el, props) {
    Object.entries(props).forEach(([key, value]) => {
        try {
            el[key] = value;
        }
        catch {
            el.setAttribute(key, String(value));
        }
    });
}
function renderComponent(payload) {
    controls.innerHTML = '';
    const registry = {
        input: () => {
            const el = document.createElement('ui-input');
            applyProps(el, payload.props);
            return el;
        },
        button: () => {
            const el = document.createElement('ui-button');
            applyProps(el, payload.props);
            el.textContent = String(payload.props.label ?? 'Button');
            return el;
        }
    };
    const create = registry[payload.component] ?? registry.button;
    controls.appendChild(create());
}
function parseInitialPayload() {
    const params = new URLSearchParams(window.location.search);
    const component = params.get('component') ?? 'button';
    const story = params.get('story') ?? 'Primary';
    let props = { label: 'Click Me', variant: 'primary', disabled: false };
    try {
        const raw = params.get('props');
        if (raw) {
            props = JSON.parse(raw);
        }
    }
    catch {
        props = { label: 'Click Me', variant: 'primary', disabled: false };
    }
    return {
        framework: 'wc',
        component,
        story,
        props
    };
}
const initialPayload = parseInitialPayload();
renderComponent(initialPayload);
window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
window.addEventListener('message', (event) => {
    if (event.data?.type !== 'UPDATE_STORY') {
        return;
    }
    const payload = event.data.payload;
    if (!payload || payload.framework !== 'wc') {
        return;
    }
    console.log('Received ->', event.data);
    renderComponent(payload);
});
canvas.appendChild(controls);
page.appendChild(canvas);
root.appendChild(page);
