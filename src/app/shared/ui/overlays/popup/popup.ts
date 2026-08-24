import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type PopupTone = 'danger' | 'warning' | 'success';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './popup.html',
  styleUrl: './popup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent {
  readonly title = input.required<string>();
  readonly message = input<string>('');
  readonly messagePrefix = input<string>('');
  readonly messageHighlight = input<string>('');
  readonly messageSuffix = input<string>('');
  readonly confirmLabel = input.required<string>();
  readonly cancelLabel = input<string>('Cancelar');
  readonly tone = input<PopupTone>('danger');

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly alertIconName = computed(() => {
    switch (this.tone()) {
      case 'success':
        return 'phosphorUserCheck';
      case 'warning':
        return 'phosphorUserMinus';
      default:
        return 'phosphorTrash';
    }
  });

  protected emitConfirm(): void {
    this.confirm.emit();
  }

  protected emitCancel(): void {
    this.cancel.emit();
  }
}

