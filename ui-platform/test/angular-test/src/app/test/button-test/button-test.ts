import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@ui-platform/angular';

@Component({
  selector: 'app-button-test',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './button-test.html',
})
export class ButtonTestComponent {
  loading = signal(false);

  handleClick() {
    if (this.loading()) return;

    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
    }, 2000);
  }

  toggleLoading() {
    this.loading.set(!this.loading());
  }
}