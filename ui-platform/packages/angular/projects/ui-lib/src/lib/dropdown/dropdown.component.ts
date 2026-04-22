import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';

ensureCustomElements();

export type DropdownOption = {
  label: string;
  value: any;
  disabled?: boolean;
  group?: string;
};

export type DropdownMode = 'single' | 'multiple';
export type DropdownVariant = 'input' | 'button' | 'icon-only';

@Component({
  selector: 'ui-dropdown-angular',
  templateUrl: './dropdown.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  options = input<DropdownOption[]>([]);
  mode = input<DropdownMode>('single');
  variant = input<DropdownVariant>('input');
  placeholder = input<string>('Select...');
  label = input<string | undefined>(undefined);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  searchable = input<boolean>(false);
  clearable = input<boolean>(false);
  open = input<boolean>(false);
  selectAll = input<boolean>(false);
  minWidth = input<string>('200px');
  maxWidth = input<string>('none');
  maxHeight = input<string>('300px');

  value = signal<any>(null);
  isDisabled = signal<boolean>(false);
  openChange = output<boolean>();
  search = output<string>();

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value.set(value ?? null);
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleValueChange(event: Event) {
    const value = (event as CustomEvent<any>).detail;

    this.value.set(value);
    this.onChange(value);
  }

  handleOpenChange(event: Event) {
    const isOpen = (event as CustomEvent<boolean>).detail;
    this.openChange.emit(isOpen);
  }

  handleSearch(event: Event) {
    const query = (event as CustomEvent<string>).detail;
    this.search.emit(query);
  }
}
