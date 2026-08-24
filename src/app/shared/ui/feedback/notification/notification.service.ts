import { Injectable, signal } from '@angular/core';

export type NotificationVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface NotificationItem {
  readonly id: number;
  readonly message: string;
  readonly variant: NotificationVariant;
  readonly duration: number;
}

interface NotificationOptions {
  readonly duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private nextId = 0;
  private readonly timeoutById = new Map<number, ReturnType<typeof setTimeout>>();

  readonly notifications = signal<readonly NotificationItem[]>([]);

  success(message: string, options?: NotificationOptions): void {
    this.open('success', message, options);
  }

  error(message: string, options?: NotificationOptions): void {
    this.open('error', message, options);
  }

  warning(message: string, options?: NotificationOptions): void {
    this.open('warning', message, options);
  }

  info(message: string, options?: NotificationOptions): void {
    this.open('info', message, options);
  }

  dismiss(id: number): void {
    const timeoutId = this.timeoutById.get(id);

    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutById.delete(id);
    }

    this.notifications.update((items) =>
      items.filter((item) => item.id !== id)
    );
  }

  private open(
    variant: NotificationVariant,
    message: string,
    options?: NotificationOptions
  ): void {
    const id = ++this.nextId;
    const duration = options?.duration ?? 2000;
    const item: NotificationItem = {
      id,
      message,
      variant,
      duration,
    };

    this.notifications.update((items) => [...items, item]);

    const timeoutId = setTimeout(() => {
      this.dismiss(id);
    }, duration);

    this.timeoutById.set(id, timeoutId);
  }
}
