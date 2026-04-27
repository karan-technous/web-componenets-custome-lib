import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  Provider,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';
import type { ChipEventDetail, IconName } from '@karan9186/core';

ensureCustomElements();

const CHIP_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UiChipComponent),
  multi: true,
};

@Component({
  selector: 'ui-chip-angular',
  templateUrl: './chip.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CHIP_VALUE_ACCESSOR],
  host: {
    '[attr.aria-disabled]': 'disabled()',
    '[class.ui-chip-ng]': 'true',
  },
})
export class UiChipComponent implements ControlValueAccessor {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  label = input<string>('');
  value = input<string>('');
  active = model<boolean>(false);
  disabled = model<boolean>(false);
  iconName = input<IconName | undefined>(undefined);
  badgeCounter = input<number | undefined>(undefined);
  removable = input<boolean>(false);
  size = input<string>('md');

  chipClick = output<ChipEventDetail>();
  chipRemove = output<ChipEventDetail>();
  chipIconClick = output<ChipEventDetail>();

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    afterNextRender(() => {
      this.setupEventListeners();
    });
  }

  writeValue(value: boolean | null): void {
    this.active.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  private setupEventListeners(): void {
    const chip = this.el.nativeElement.querySelector('ui-chip');

    if (!chip) {
      return;
    }

    const clickHandler = (event: Event) => {
      const detail = (event as CustomEvent<ChipEventDetail>).detail;
      const nextActive = !this.active();

      this.active.set(nextActive);
      this.onChange(nextActive);
      this.onTouched();
      this.chipClick.emit(detail);
    };

    const removeHandler = (event: Event) => {
      this.onTouched();
      this.chipRemove.emit((event as CustomEvent<ChipEventDetail>).detail);
    };

    const iconClickHandler = (event: Event) => {
      this.chipIconClick.emit((event as CustomEvent<ChipEventDetail>).detail);
    };

    chip.addEventListener('chipClick', clickHandler);
    chip.addEventListener('chipRemove', removeHandler);
    chip.addEventListener('chipIconClick', iconClickHandler);

    this.destroyRef.onDestroy(() => {
      chip.removeEventListener('chipClick', clickHandler);
      chip.removeEventListener('chipRemove', removeHandler);
      chip.removeEventListener('chipIconClick', iconClickHandler);
    });
  }
}

@Directive({
  selector: 'button[uiChip], span[uiChip], div[uiChip]',
  standalone: true,
  host: {
    '[attr.data-ui-chip]': '"true"',
    '[attr.data-active]': 'active()',
    '[attr.data-disabled]': 'disabled()',
    '[attr.data-removable]': 'removable()',
    '[attr.data-icon-name]': 'iconName()',
    '[attr.data-badge-counter]': 'badgeCounter()',
    '[attr.aria-pressed]': 'active()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
  },
})
export class UiChipDirective {
  label = input<string>('');
  value = input<string>('');
  active = input<boolean>(false);
  disabled = input<boolean>(false);
  iconName = input<IconName | undefined>(undefined);
  badgeCounter = input<number | undefined>(undefined);
  removable = input<boolean>(false);
}
