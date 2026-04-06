import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { UiButton as Button, UiInput as Input } from '@karan9186/react';
import './theme.css';
const ButtonWrapper = Button;
const InputWrapper = Input;
const initialPayload = {
    framework: 'react',
    component: 'button',
    story: 'Primary',
    props: {
        label: 'Click Me',
        variant: 'primary',
        disabled: false
    }
};
function parsePayloadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const component = params.get('component') ?? initialPayload.component;
    const story = params.get('story') ?? initialPayload.story;
    const propsRaw = params.get('props');
    let parsedProps = initialPayload.props;
    if (propsRaw) {
        try {
            const value = JSON.parse(propsRaw);
            parsedProps = value;
        }
        catch {
            parsedProps = initialPayload.props;
        }
    }
    return {
        framework: 'react',
        component,
        story,
        props: parsedProps
    };
}
export default function App() {
    const [payload, setPayload] = useState(parsePayloadFromUrl());
    const [inputValue, setInputValue] = useState(String(payload.props.value ?? ''));
    useEffect(() => {
        setInputValue(String(payload.props.value ?? ''));
    }, [payload.props.value]);
    useEffect(() => {
        const handler = (event) => {
            if (event.data?.type !== 'UPDATE_STORY') {
                return;
            }
            const nextPayload = event.data.payload;
            if (!nextPayload || nextPayload.framework !== 'react') {
                return;
            }
            console.log('Received ->', event.data);
            setPayload(nextPayload);
        };
        window.addEventListener('message', handler);
        window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
        return () => window.removeEventListener('message', handler);
    }, []);
    const componentRegistry = useMemo(() => ({
        input: () => (_jsx(InputWrapper, { value: inputValue, placeholder: String(payload.props.placeholder ?? 'Type here'), disabled: Boolean(payload.props.disabled ?? false), onChange: setInputValue })),
        button: () => (_jsx(ButtonWrapper, { variant: String(payload.props.variant ?? 'primary'), disabled: Boolean(payload.props.disabled ?? false), children: String(payload.props.label ?? 'Button') }))
    }), [inputValue, payload.props]);
    const renderComponent = componentRegistry[payload.component] ?? componentRegistry.button;
    return (_jsx("main", { className: "page", children: _jsx("section", { className: "canvas", children: _jsx("div", { className: "controls", children: renderComponent() }) }) }));
}
