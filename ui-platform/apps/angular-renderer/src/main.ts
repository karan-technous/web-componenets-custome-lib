import '@angular/compiler';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  type Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import * as AngularWrappers from '@karan9186/angular';
import { applyTheme, lightTheme, darkTheme } from '@karan9186/core';

type StoryPayload = {
  framework: 'angular' | 'react' | 'wc';
  component: string;
  story: string;
  code: string;
  angularImports?: string[];
};

const params = new URLSearchParams(window.location.search);
const appearance = params.get('appearance') === 'light' ? 'light' : 'dark';
const coreTheme = appearance === 'light' ? lightTheme : darkTheme;

try {
  applyTheme(coreTheme);
} catch (error) {
  console.error('Failed to apply initial theme:', error);
}

const rootStyle = document.documentElement.style;
rootStyle.setProperty('--bridge-ui-primary', '#f43f5e');
rootStyle.setProperty('--bridge-ui-bg', appearance === 'light' ? '#ffffff' : '#0b1020');
rootStyle.setProperty('--bridge-ui-surface', appearance === 'light' ? '#ffffff' : '#12182a');
rootStyle.setProperty('--bridge-ui-ring', 'rgba(244, 63, 94, 0.3)');
document.documentElement.dataset.appearance = appearance;

function resolveImports(names: string[] | undefined): Type<unknown>[] {
  return (names ?? [])
    .map((name) => (AngularWrappers as Record<string, unknown>)[name])
    .filter((value): value is Type<unknown> => typeof value === 'function');
}

function applyAppearance(nextAppearance: 'dark' | 'light') {
  const nextTheme = nextAppearance === 'light' ? lightTheme : darkTheme;
  document.documentElement.dataset.appearance = nextAppearance;
  applyTheme(nextTheme);
  rootStyle.setProperty('--bridge-ui-bg', nextAppearance === 'light' ? '#ffffff' : '#0b1020');
  rootStyle.setProperty('--bridge-ui-surface', nextAppearance === 'light' ? '#ffffff' : '#12182a');
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="page">
      <div class="controls">
        <ng-container #container></ng-container>
      </div>
    </main>
  `,
})
class RuntimeHostComponent implements OnInit, OnDestroy {
  constructor(
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  @ViewChild('container', { read: ViewContainerRef, static: true })
  private container!: ViewContainerRef;

  private readonly handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'UPDATE_THEME') {
      const nextAppearance = event.data.appearance === 'light' ? 'light' : 'dark';
      applyAppearance(nextAppearance);
      return;
    }

    if (event.data?.type !== 'RUN_STORY') {
      return;
    }

    const payload = event.data.payload as StoryPayload;
    if (!payload || payload.framework !== 'angular') {
      return;
    }

    this.zone.run(() => {
      this.renderStory(payload.code, payload.angularImports);
    });
  };

  ngOnInit(): void {
    window.addEventListener('message', this.handleMessage);
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.handleMessage);
  }

  private renderStory(template: string, importNames: string[] = []): void {
    try {
      const DynamicStoryComponent = Component({
        standalone: true,
        imports: resolveImports(importNames),
        template,
      })(class RuntimeStoryComponent {});

      this.container.clear();
      this.container.createComponent(DynamicStoryComponent);
      this.cdr.detectChanges();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to render Angular story.';
      console.error('Angular renderer story failure:', error);

      const ErrorComponent = Component({
        standalone: true,
        template: `<div class="bridge-error">${message}</div>`,
      })(class RuntimeStoryErrorComponent {});

      this.container.clear();
      this.container.createComponent(ErrorComponent);
      this.cdr.detectChanges();
    }
  }
}

bootstrapApplication(RuntimeHostComponent).catch((error) => {
  console.error('Failed to bootstrap Angular renderer:', error);
  const host = document.querySelector('app-root');
  if (host) {
    host.innerHTML = `<main class="page"><div class="controls"><div class="bridge-error">${
      error instanceof Error ? error.message : 'Failed to bootstrap Angular renderer.'
    }</div></div></main>`;
  }
});
