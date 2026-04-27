import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';
import type {
  TooltipPosition,
  TooltipTrigger,
  TooltipVariant,
} from '@karan9186/core';

ensureCustomElements();

@Component({
  selector: 'ui-tooltip-angular',
  standalone: true,
  templateUrl: './tooltip.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTooltipComponent),
      multi: true,
    },
  ],
})
export class UiTooltipComponent implements ControlValueAccessor {
  content = input<string | undefined>(undefined);
  position = input<TooltipPosition>('top');
  trigger = input<TooltipTrigger>('hover');
  open = input<boolean | undefined>(undefined);
  disabled = input<boolean>(false);
  variant = input<TooltipVariant>('simple');
  delay = input<number>(150);

  openState = signal(false);
  disabledState = signal(false);
  openChange = output<boolean>();

  readonly resolvedOpen = computed(() =>
    this.open() !== undefined ? !!this.open() : this.openState(),
  );

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean | null): void {
    this.openState.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  handleOpenChange(event: Event): void {
    const nextOpen = !!(event as CustomEvent<boolean>).detail;
    this.openState.set(nextOpen);
    this.onChange(nextOpen);
    this.onTouched();
    this.openChange.emit(nextOpen);
  }
}

@Directive({
  selector: '[uiTooltip]',
  standalone: true,
})
export class UiTooltipDirective implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly wrapper = this.renderer.createElement('ui-tooltip') as HTMLElement & {
    content?: string;
    position?: TooltipPosition;
    trigger?: TooltipTrigger;
    open?: boolean;
    disabled?: boolean;
    variant?: TooltipVariant;
    delay?: number;
  };

  uiTooltip = input.required<string>();
  uiTooltipPosition = input<TooltipPosition>('top');
  uiTooltipTrigger = input<TooltipTrigger>('hover');
  uiTooltipOpen = input<boolean | undefined>(undefined);
  uiTooltipDisabled = input<boolean>(false);
  uiTooltipVariant = input<TooltipVariant>('simple');
  uiTooltipDelay = input<number>(150);
  uiTooltipOpenChange = output<boolean>();

  constructor() {
    const host = this.host.nativeElement;
    const parent = host.parentNode;
    if (parent) {
      this.renderer.insertBefore(parent, this.wrapper, host);
      this.renderer.appendChild(this.wrapper, host);
    }

    this.wrapper.addEventListener('openChange', this.handleOpenChange as EventListener);

    effect(() => {
      this.wrapper.content = this.uiTooltip();
      this.wrapper.position = this.uiTooltipPosition();
      this.wrapper.trigger = this.uiTooltipTrigger();
      this.wrapper.open = this.uiTooltipOpen();
      this.wrapper.disabled = this.uiTooltipDisabled();
      this.wrapper.variant = this.uiTooltipVariant();
      this.wrapper.delay = this.uiTooltipDelay();
    });
  }

  ngOnDestroy(): void {
    const host = this.host.nativeElement;
    const parent = this.wrapper.parentNode;
    if (parent) {
      this.renderer.insertBefore(parent, host, this.wrapper);
      this.renderer.removeChild(parent, this.wrapper);
    }

    this.wrapper.removeEventListener('openChange', this.handleOpenChange as EventListener);
  }

  private handleOpenChange = (event: Event) => {
    this.uiTooltipOpenChange.emit(!!(event as CustomEvent<boolean>).detail);
  };
}
