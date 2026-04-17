import { Component, ChangeDetectionStrategy, input, output, ElementRef, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export interface BreadcrumbItem {
  value: string;
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'ui-breadcrumb-wrapper',
  standalone: true,
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiBreadcrumbComponent {
  private hostElement = inject(ElementRef);

  // === INPUTS ===

  /** Breadcrumb items as JSON string */
  items = input('');

  /** Separator between items */
  separator = input<'slash' | 'chevron' | 'arrow' | string>('slash');

  /** Maximum number of items before collapsing */
  maxItems = input<number>();

  /** Number of items to show before collapse indicator */
  itemsBeforeCollapse = input<number>(1);

  /** Number of items to show after collapse indicator */
  itemsAfterCollapse = input<number>(1);

  /** Whether the breadcrumb is disabled */
  disabled = input(false);

  // === OUTPUTS ===

  /** Callback when a breadcrumb item is clicked */
  uiClick = output<{ value: string; index: number; href?: string }>();

  // === METHODS ===

  handleUiClick(event: CustomEvent): void {
    this.uiClick.emit(event.detail);
  }
}
