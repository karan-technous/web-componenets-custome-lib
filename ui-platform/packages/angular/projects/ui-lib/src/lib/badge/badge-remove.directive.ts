import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[uiBadgeRemove]',
  standalone: true,
})
export class BadgeRemoveDirective {
  /** Callback when the badge is removed */
  remove = output<void>();

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit();
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.remove.emit();
    }
  }
}
