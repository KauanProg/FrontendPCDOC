import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';

import {
  NotificationItem,
  NotificationService,
  NotificationVariant,
} from './notification.service';

interface NotificationViewModel extends NotificationItem {
  readonly icon: string;
  readonly closeLabel: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  private readonly notificationService = inject(NotificationService);

  protected readonly notifications = computed<
    readonly NotificationViewModel[]
  >(() =>
    this.notificationService.notifications().map((notification) => ({
      ...notification,
      icon: this.getIcon(notification.variant),
      closeLabel: `Fechar notificacao: ${notification.message}`,
    }))
  );

  protected close(id: number): void {
    this.notificationService.dismiss(id);
  }

  private getIcon(variant: NotificationVariant): string {
    switch (variant) {
      case 'success':
        return 'phosphorCheck';
      case 'error':
        return 'phosphorExclamationMark';
      case 'warning':
        return 'phosphorExclamationMark';
      case 'info':
        return 'phosphorExclamationMark';
    }
  }
}
