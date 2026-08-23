import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, Output, EventEmitter, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

export interface ExportOption {
  readonly format: ExportFormat;
  readonly label: string;
  readonly icon: string;
}

const DEFAULT_OPTIONS: readonly ExportOption[] = [
  { format: 'csv', label: 'CSV', icon: 'phosphorFileCsv' },
  { format: 'xlsx', label: 'XLSX', icon: 'phosphorFileXls' },
  { format: 'pdf', label: 'PDF', icon: 'phosphorFilePdf' },
];

@Component({
  selector: 'app-export-dropdown',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './export-dropdown.html',
  styleUrl: './export-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportDropdownComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input() options: readonly ExportOption[] = DEFAULT_OPTIONS;
  @Input() loading = false;
  @Input() disabled = false;
  @Output() readonly formatSelected = new EventEmitter<ExportFormat>();

  protected open = false;

  protected toggle(): void {
    if (this.loading || this.disabled) return;
    this.open = !this.open;
  }

  protected select(format: ExportFormat): void {
    if (this.loading || this.disabled) return;
    this.open = false;
    this.formatSelected.emit(format);
  }

  @HostListener('document:click', ['$event'])
  protected closeOnOutsideClick(event: MouseEvent): void {
    if (this.open && !this.elementRef.nativeElement.contains(event.target as Node)) this.open = false;
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void { this.open = false; }
}
