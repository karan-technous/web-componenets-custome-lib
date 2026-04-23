import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { ensureCustomElements } from '../register-custom-elements';

ensureCustomElements();

export type SpinnerVariant = 'circular' | 'dots' | 'bars' | 'pulse' | 'ring';
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

/**
 * Modern Angular Spinner Component
 * Standalone component with signals-based inputs/outputs
 * Wraps ui-spinner web component
 *
 * @usage
 * <ui-spinner-angular
 *   variant="circular"
 *   size="md"
 *   [loading]="isLoading"
 *   [overlay]="false"
 *   label="Loading..."
 *   (shown)="onShown()"
 *   (hidden)="onHidden()"
 * />
 */
@Component({
  selector: 'ui-spinner-angular',
  templateUrl: './spinner.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-spinner-ng]': 'true',
  },
})
export class SpinnerComponent implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private eventListeners: (() => void)[] = [];

  // === SIGNAL INPUTS ===

  /** Animation variant style */
  variant = input<SpinnerVariant>('circular');

  /** Size of the spinner */
  size = input<SpinnerSize | number>('md');

  /** Animation speed */
  speed = input<SpinnerSpeed | number>('normal');

  /** Primary color for the spinner */
  color = input<string | undefined>(undefined);

  /** Background/track color */
  trackColor = input<string | undefined>(undefined);

  /** Whether the spinner is visible */
  loading = input<boolean>(true);

  /** Display as fullscreen/container overlay */
  overlay = input<boolean>(false);

  /** Display inline with text (no flex center) */
  inline = input<boolean>(false);

  /** Center the spinner in its container */
  center = input<boolean>(false);

  /** Primary label text (e.g., "Loading...") */
  label = input<string | undefined>(undefined);

  /** Secondary label text (e.g., "Please wait") */
  subLabel = input<string | undefined>(undefined);

  // === OUTPUTS ===

  /** Emitted when spinner becomes visible */
  shown = output<void>();

  /** Emitted when spinner becomes hidden */
  hidden = output<void>();

  // === LIFECYCLE ===

  ngOnInit(): void {
    this.setupEventListeners();
    this.syncPropsToWebComponent();
  }

  ngOnDestroy(): void {
    this.eventListeners.forEach((remove) => remove());
  }

  // === PRIVATE METHODS ===

  private setupEventListeners(): void {
    const spinner = this.el.nativeElement.querySelector('ui-spinner');
    if (!spinner) return;

    // Shown event
    const shownHandler = () => this.shown.emit();
    spinner.addEventListener('shown', shownHandler);
    this.eventListeners.push(() =>
      spinner.removeEventListener('shown', shownHandler)
    );

    // Hidden event
    const hiddenHandler = () => this.hidden.emit();
    spinner.addEventListener('hidden', hiddenHandler);
    this.eventListeners.push(() =>
      spinner.removeEventListener('hidden', hiddenHandler)
    );
  }

  private syncPropsToWebComponent(): void {
    // Props are synced via template binding in spinner.component.html
  }
}
