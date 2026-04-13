import { Directive, Input, HostListener } from '@angular/core';
import { ToastService } from './toast.service';

@Directive({
  selector: '[toastTrigger]',
  standalone: true,
})
export class ToastTriggerDirective {
  @Input('toastTrigger') options: any;

  constructor(private toast: ToastService) {}

  @HostListener('click')
  onClick() {
    this.toast.show(this.options);
  }
}
