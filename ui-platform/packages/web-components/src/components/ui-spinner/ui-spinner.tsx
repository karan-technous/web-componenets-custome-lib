import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  Watch,
} from '@stencil/core';
import { BaseComponent } from '../base/base-component';

export type SpinnerVariant = 'circular' | 'dots' | 'bars' | 'pulse' | 'ring';
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

/**
 * UI Spinner Component
 * Highly customizable loading spinner with multiple animation variants
 * Supports theming, accessibility, and various display modes
 *
 * @slot label - Custom label text
 *
 * @event shown - Emitted when spinner becomes visible
 * @event hidden - Emitted when spinner becomes hidden
 */
@Component({
  tag: 'ui-spinner',
  styleUrl: 'ui-spinner.css',
  shadow: true,
})
export class UiSpinner extends BaseComponent {
  @Element() hostElement!: HTMLElement;

  // === VARIANTS ===

  /**
   * Animation variant style
   * @default 'circular'
   */
  @Prop({ reflect: true }) variant: SpinnerVariant = 'circular';

  /**
   * Size of the spinner
   * @default 'md'
   */
  @Prop({ reflect: true }) size: SpinnerSize | number = 'md';

  /**
   * Animation speed
   * @default 'normal'
   */
  @Prop({ reflect: true }) speed: SpinnerSpeed | number = 'normal';

  // === COLORS ===

  /**
   * Primary color for the spinner
   * Uses CSS variable --ui-primary if not specified
   */
  @Prop() color?: string;

  /**
   * Background/track color
   * Uses CSS variable --ui-spinner-track if not specified
   */
  @Prop() trackColor?: string;

  // === STATE ===

  /**
   * Whether the spinner is visible
   * @default true
   */
  @Prop({ reflect: true, mutable: true }) loading: boolean = true;

  /**
   * Display as fullscreen/container overlay
   * @default false
   */
  @Prop({ reflect: true }) overlay: boolean = false;

  /**
   * Display inline with text (no flex center)
   * @default false
   */
  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * Center the spinner in its container
   * @default false
   */
  @Prop({ reflect: true }) center: boolean = false;

  // === LABELS ===

  /**
   * Primary label text (e.g., "Loading...")
   */
  @Prop() label?: string;

  /**
   * Secondary label text (e.g., "Please wait")
   */
  @Prop() subLabel?: string;

  // === EVENTS ===

  /**
   * Emitted when spinner becomes visible
   */
  @Event({ bubbles: true, composed: true }) shown!: EventEmitter<void>;

  /**
   * Emitted when spinner becomes hidden
   */
  @Event({ bubbles: true, composed: true }) hidden!: EventEmitter<void>;

  // === WATCHERS ===

  @Watch('loading')
  onLoadingChange(newLoading: boolean, oldLoading: boolean) {
    if (newLoading && !oldLoading) {
      this.shown.emit();
    } else if (!newLoading && oldLoading) {
      this.hidden.emit();
    }
  }

  // === PRIVATE METHODS ===

  private getSizeValue(): string {
    if (typeof this.size === 'number') {
      return `${this.size}px`;
    }

    const sizeMap: Record<SpinnerSize, string> = {
      xs: '16px',
      sm: '20px',
      md: '24px',
      lg: '32px',
      xl: '40px',
    };

    return sizeMap[this.size] || sizeMap.md;
  }

  private getSpeedValue(): string {
    if (typeof this.speed === 'number') {
      return `${this.speed}s`;
    }

    const speedMap: Record<SpinnerSpeed, string> = {
      slow: '2s',
      normal: '1s',
      fast: '0.5s',
    };

    return speedMap[this.speed] || speedMap.normal;
  }

  private getSpinnerClasses(): string {
    const classes = ['spinner', `spinner--${this.variant}`, `spinner--${this.size}`];

    if (this.overlay) {
      classes.push('spinner--overlay');
    }

    if (this.inline) {
      classes.push('spinner--inline');
    }

    if (this.center) {
      classes.push('spinner--center');
    }

    return classes.join(' ');
  }

  private renderCircular() {
    return (
      <svg
        class="spinner__circular"
        viewBox="0 0 50 50"
        style={{
          width: this.getSizeValue(),
          height: this.getSizeValue(),
          '--spinner-speed': this.getSpeedValue(),
          '--spinner-color': this.color || 'var(--ui-primary, currentColor)',
          '--spinner-track': this.trackColor || 'var(--ui-spinner-track, rgba(0,0,0,0.1))',
        }}
      >
        <circle
          class="spinner__track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="var(--spinner-track)"
          stroke-width="4"
        />
        <circle
          class="spinner__indicator"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="var(--spinner-color)"
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>
    );
  }

  private renderDots() {
    const dotStyle = {
      '--spinner-speed': this.getSpeedValue(),
      '--spinner-color': this.color || 'var(--ui-primary, currentColor)',
    };

    const size = this.getSizeValue();
    const dotSize = typeof this.size === 'number' 
      ? `${this.size * 0.3}px` 
      : `${parseInt(this.getSizeValue()) * 0.3}px`;

    return (
      <div class="spinner__dots" style={dotStyle}>
        {[0, 1, 2].map((i) => (
          <div
            class="spinner__dot"
            style={{
              width: dotSize,
              height: dotSize,
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    );
  }

  private renderBars() {
    const barStyle = {
      '--spinner-speed': this.getSpeedValue(),
      '--spinner-color': this.color || 'var(--ui-primary, currentColor)',
    };

    const size = this.getSizeValue();
    const barWidth = typeof this.size === 'number'
      ? `${this.size * 0.15}px`
      : `${parseInt(this.getSizeValue()) * 0.15}px`;
    const barHeight = typeof this.size === 'number'
      ? `${this.size * 0.6}px`
      : `${parseInt(this.getSizeValue()) * 0.6}px`;

    return (
      <div class="spinner__bars" style={barStyle}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            class="spinner__bar"
            style={{
              width: barWidth,
              height: barHeight,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  private renderPulse() {
    return (
      <div
        class="spinner__pulse"
        style={{
          width: this.getSizeValue(),
          height: this.getSizeValue(),
          '--spinner-speed': this.getSpeedValue(),
          '--spinner-color': this.color || 'var(--ui-primary, currentColor)',
        }}
      >
        <div class="spinner__pulse-ring" />
        <div class="spinner__pulse-ring" />
        <div class="spinner__pulse-ring" />
      </div>
    );
  }

  private renderRing() {
    return (
      <div
        class="spinner__ring"
        style={{
          width: this.getSizeValue(),
          height: this.getSizeValue(),
          '--spinner-speed': this.getSpeedValue(),
          '--spinner-color': this.color || 'var(--ui-primary, currentColor)',
        }}
      >
        <div class="spinner__ring-circle" />
        <div class="spinner__ring-circle" />
      </div>
    );
  }

  private renderSpinner() {
    switch (this.variant) {
      case 'circular':
        return this.renderCircular();
      case 'dots':
        return this.renderDots();
      case 'bars':
        return this.renderBars();
      case 'pulse':
        return this.renderPulse();
      case 'ring':
        return this.renderRing();
      default:
        return this.renderCircular();
    }
  }

  // === RENDER ===

  render() {
    if (!this.loading) {
      return null;
    }

    const spinnerClasses = this.getSpinnerClasses();

    return (
      <Host class={spinnerClasses}>
        {this.overlay && <div class="spinner__overlay" />}
        
        <div class="spinner__container">
          {this.renderSpinner()}

          {(this.label || this.subLabel) && (
            <div class="spinner__labels">
              {this.label && (
                <div class="spinner__label">
                  <slot name="label">{this.label}</slot>
                </div>
              )}
              {this.subLabel && (
                <div class="spinner__sub-label">{this.subLabel}</div>
              )}
            </div>
          )}

          {/* Screen reader only text */}
          <span class="spinner__sr-only" role="status" aria-live="polite">
            {this.label || 'Loading'}
          </span>
        </div>
      </Host>
    );
  }
}
