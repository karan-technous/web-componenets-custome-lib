import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { UiButton as Button, UiInput as Input } from '@karan9186/react';
import './theme.css';

const ButtonWrapper = Button;
const InputWrapper = Input;

type StoryPayload = {
  framework: 'angular' | 'react' | 'wc';
  component: string;
  story: string;
  props: Record<string, string | boolean>;
};

const initialPayload: StoryPayload = {
  framework: 'react',
  component: 'button',
  story: 'Primary',
  props: {
    label: 'Click Me',
    variant: 'primary',
    disabled: false
  }
};

function parsePayloadFromUrl(): StoryPayload {
  const params = new URLSearchParams(window.location.search);
  const component = params.get('component') ?? initialPayload.component;
  const story = params.get('story') ?? initialPayload.story;
  const propsRaw = params.get('props');

  let parsedProps = initialPayload.props;
  if (propsRaw) {
    try {
      const value = JSON.parse(propsRaw) as Record<string, string | boolean>;
      parsedProps = value;
    } catch {
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
  const [payload, setPayload] = useState<StoryPayload>(parsePayloadFromUrl());
  const [inputValue, setInputValue] = useState(String(payload.props.value ?? ''));

  useEffect(() => {
    setInputValue(String(payload.props.value ?? ''));
  }, [payload.props.value]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== 'UPDATE_STORY') {
        return;
      }

      const nextPayload = event.data.payload as StoryPayload;
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

  const componentRegistry: Record<string, () => ReactElement> = useMemo(
    () => ({
      input: () => (
        <InputWrapper
          value={inputValue}
          placeholder={String(payload.props.placeholder ?? 'Type here')}
          disabled={Boolean(payload.props.disabled ?? false)}
          onChange={setInputValue}
        />
      ),
      button: () => (
        <ButtonWrapper
          variant={String(payload.props.variant ?? 'primary') as 'primary' | 'secondary' | 'outline'}
          disabled={Boolean(payload.props.disabled ?? false)}
        >
          {String(payload.props.label ?? 'Button')}
        </ButtonWrapper>
      )
    }),
    [inputValue, payload.props]
  );

  const renderComponent = componentRegistry[payload.component] ?? componentRegistry.button;

  return (
    <main className="page">
      <section className="canvas">
        <div className="controls">{renderComponent()}</div>
      </section>
    </main>
  );
}
