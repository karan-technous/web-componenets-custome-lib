import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@ui-platform/angular';

type InputItem = {
  value: string;
  placeholder: string;
  disabled: boolean;
};

@Component({
  selector: 'app-input-test',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './input-test.html',
})
export class InputTest {
  TOTAL = 500;

  inputs = signal<InputItem[]>(
    Array.from({ length: this.TOTAL }, (_, i) => ({
      value: '',
      placeholder: `Input ${i}`,
      disabled: false,
    })),
  );

  //  Update single input
  updateValue(index: number, value: string) {
    this.inputs.update((arr) => {
      const copy = [...arr];
      copy[index] = { ...copy[index], value };
      return copy;
    });
  }

  // Toggle one
  toggleOne(index: number) {
    this.inputs.update((arr) => {
      const copy = [...arr];
      copy[index] = {
        ...copy[index],
        disabled: !copy[index].disabled,
      };
      return copy;
    });
  }

  // Update ALL placeholders
  updateAllPlaceholders() {
    this.inputs.update((arr) =>
      arr.map((item, i) => ({
        ...item,
        placeholder: `Updated ${i}`,
      })),
    );
  }

  // Fill all values
  fillAll() {
    this.inputs.update((arr) =>
      arr.map((item, i) => ({
        ...item,
        value: `Value ${i}`,
      })),
    );
  }
}
