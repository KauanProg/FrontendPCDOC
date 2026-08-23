import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface SegmentedControlOption {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-segmented-control',
  standalone: true,
  templateUrl: './segmented-control.html',
  styleUrl: './segmented-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedControlComponent {
  @Input() options: readonly SegmentedControlOption[] = [];
  @Input() value = '';
  @Input() ariaLabel = 'Opções';
  @Output() valueChange = new EventEmitter<string>();

  protected select(option: SegmentedControlOption): void {
    if (option.value !== this.value) this.valueChange.emit(option.value);
  }
}
