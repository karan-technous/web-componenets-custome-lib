import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  forwardRef,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToastService } from './toast.service';

@Component({
  selector: 'ui-toast-angular',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ui-toast #wc></ui-toast>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiToastComponent),
      multi: true,
    },
  ],
})
export class UiToastComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('wc', { static: true }) wcRef!: ElementRef<any>;

  private el!: any;
  private toastService = inject(ToastService);

  @Output() opened = new EventEmitter<any>();
  @Output() closed = new EventEmitter<any>();

  private onChange = (_: any) => {};
  private onTouched = () => {};

  // -----------------------
  // Lifecycle
  // -----------------------

  ngAfterViewInit() {
    this.el = this.wcRef.nativeElement;

    // auto register (no manual ViewChild needed in app)
    this.toastService.register(this);

    this.el.addEventListener('toastShow', this.handleShow);
    this.el.addEventListener('toastClose', this.handleClose);
  }

  ngOnDestroy() {
    this.el?.removeEventListener('toastShow', this.handleShow);
    this.el?.removeEventListener('toastClose', this.handleClose);
  }

  // -----------------------
  // Events
  // -----------------------

  private handleShow = (e: any) => {
    this.opened.emit(e.detail);
    this.onChange(e.detail); // CVA sync
  };

  private handleClose = (e: any) => {
    this.closed.emit(e.detail);
  };

  // -----------------------
  // Public API (delegates to WC)
  // -----------------------

  show(options: any) {
    this.el?.show(options);
  }

  dismiss(id?: string) {
    this.el?.dismiss(id);
  }

  // -----------------------
  // CVA
  // -----------------------

  writeValue(_: any): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.el) {
      this.el.disabled = isDisabled;
    }
  }
}
