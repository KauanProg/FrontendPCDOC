import { NgIcon } from '@ng-icons/core';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  readonly title = input.required<string>();
  readonly labelledBy = input('modal-title');
  readonly closeDisabled = input(false);
  readonly closed = output<void>();

  protected close(): void {
    if (!this.closeDisabled()) this.closed.emit();
  }
}
