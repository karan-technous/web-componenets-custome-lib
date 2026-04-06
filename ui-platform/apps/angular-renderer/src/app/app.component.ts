import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ButtonComponent, InputComponent } from '@karan9186/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="preview-root">
      <main class="page">
        <div class="controls">
          <ng-container #container></ng-container>
        </div>
      </main>
    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  @ViewChild('container', { read: ViewContainerRef, static: true })
  private container!: ViewContainerRef;

  private readonly wrapperRenderers: Record<
    string,
    (props: Record<string, string | boolean>) => void
  > = {
    button: (props) => this.renderButtonWrapper(props),
    input: (props) => this.renderInputWrapper(props)
  };

  private readonly handleMessage = (event: MessageEvent) => {
    if (event.data?.type !== 'UPDATE_STORY') {
      return;
    }

    const payload = event.data.payload as {
      framework: 'angular' | 'react' | 'wc';
      component: string;
      story: string;
      props: Record<string, string | boolean>;
    };

    if (!payload || payload.framework !== 'angular') {
      return;
    }

    console.log('Received ->', event.data);
    this.zone.run(() => {
      this.applyPayload(payload);
      this.cdr.detectChanges();
    });
  };

  ngOnInit(): void {
    this.applyPayload(this.parseInitialPayload());
    window.addEventListener('message', this.handleMessage);
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.handleMessage);
  }

  private parseInitialPayload() {
    const params = new URLSearchParams(window.location.search);
    const component = params.get('component') ?? 'button';
    const story = params.get('story') ?? 'Primary';
    let props: Record<string, string | boolean> = { label: 'Click Me', variant: 'primary', disabled: false };

    try {
      const raw = params.get('props');
      if (raw) {
        props = JSON.parse(raw) as Record<string, string | boolean>;
      }
    } catch {
      props = { label: 'Click Me', variant: 'primary', disabled: false };
    }

    return {
      framework: 'angular' as const,
      component,
      story,
      props
    };
  }

  private applyPayload(payload: {
    framework: 'angular' | 'react' | 'wc';
    component: string;
    story: string;
    props: Record<string, string | boolean>;
  }): void {
    const componentKey = payload.component in this.wrapperRenderers ? payload.component : 'button';
    const renderWrapper = this.wrapperRenderers[componentKey];

    this.container.clear();
    renderWrapper(payload.props);
  }

  private renderButtonWrapper(props: Record<string, string | boolean>): void {
    const label = String(props.label ?? 'Button');
    const ref = this.container.createComponent(ButtonComponent, {
      projectableNodes: [[document.createTextNode(label)]]
    });

    const variant = String(props.variant ?? 'primary');
    ref.setInput('variant', variant === 'secondary' || variant === 'outline' ? variant : 'primary');
    ref.setInput('disabled', this.toBoolean(props.disabled));
    ref.changeDetectorRef.detectChanges();
  }

  private renderInputWrapper(props: Record<string, string | boolean>): void {
    const ref = this.container.createComponent(InputComponent);
    ref.setInput('placeholder', String(props.placeholder ?? 'Type here'));
    ref.instance.writeValue(String(props.value ?? ''));
    ref.instance.setDisabledState(this.toBoolean(props.disabled));
    ref.changeDetectorRef.detectChanges();
  }

  private toBoolean(value: string | boolean | undefined): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      return normalized === 'true' || normalized === '1' || normalized === 'yes';
    }

    return false;
  }
}
