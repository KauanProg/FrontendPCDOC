import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export type FilterStatusOption = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  readonly filtersCount = input<number>(0);

  readonly clearFilters = output<void>();

  protected readonly isPanelOpen = signal<boolean>(false);

  private readonly host = inject(ElementRef<HTMLElement>);

  protected togglePanel(event: Event): void {
    event.stopPropagation();
    this.isPanelOpen.update((value) => !value);
  }

  protected onPanelClick(event: Event): void {
    event.stopPropagation();
  }

  protected clearAll(event: Event): void {
    event.stopPropagation();
    this.clearFilters.emit();
  }

  @HostListener('document:click', ['$event'])
  protected onOutsideClick(event: MouseEvent): void {
    const target = event.target as Node | null;

    if (!target) {
      return;
    }

    if (!this.host.nativeElement.contains(target)) {
      this.isPanelOpen.set(false);
    }
  }
}
