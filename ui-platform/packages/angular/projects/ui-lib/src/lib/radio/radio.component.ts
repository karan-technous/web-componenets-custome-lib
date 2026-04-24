import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  forwardRef,
  input,
  output,
} from '@angular/core';
import { ensureCustomElements } from '../register-custom-elements';

ensureCustomElements();

@Component({
  selector: 'ui-radio-angular',
  standalone: true,
  templateUrl: './radio.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiRadioComponent {
  value = input.required<string>();
  checked = input<boolean>(false);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  name = input<string | undefined>(undefined);
  error = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  label = input<string | undefined>(undefined);
  supportingText = input<string | undefined>(undefined);

  uiChange = output<string>();
  uiFocus = output<void>();
  uiBlur = output<void>();

  handleChange(event: Event): void {
    this.uiChange.emit((event as CustomEvent<string>).detail);
  }

  handleFocus(): void {
    this.uiFocus.emit();
  }

  handleBlur(): void {
    this.uiBlur.emit();
  }
}

@Directive({
  selector: '[uiRadio]',
  standalone: true,
  host: {
    '[attr.data-ui-radio]': '"true"',
  },
})
export class UiRadioDirective {}
