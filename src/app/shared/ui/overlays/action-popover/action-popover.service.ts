import { Injectable, signal } from '@angular/core';

export type ActionPopoverTone = 'default' | 'info' | 'warning' | 'success' | 'danger';

export type ActionPopoverItem = {
  id: string;
  label: string;
  iconName: string;
  tone?: ActionPopoverTone;
};

type ActionPopoverState = {
  key?: string;
  origin: HTMLElement;
  items: readonly ActionPopoverItem[];
  onSelect: (actionId: string) => void;
};

type OpenActionPopoverParams = {
  trigger: HTMLElement;
  items: readonly ActionPopoverItem[];
  onSelect: (actionId: string) => void;
  key?: string;
};

@Injectable({ providedIn: 'root' })
export class ActionPopoverService {
  private readonly popoverState = signal<ActionPopoverState | null>(null);

  readonly state = this.popoverState.asReadonly();

  open(params: OpenActionPopoverParams): void {
    this.popoverState.set({
      key: params.key,
      origin: params.trigger,
      items: params.items,
      onSelect: params.onSelect,
    });
  }

  toggle(params: OpenActionPopoverParams): void {
    const current = this.popoverState();

    if (current?.key && params.key && current.key === params.key) {
      this.close();
      return;
    }

    this.open(params);
  }

  close(): void {
    this.popoverState.set(null);
  }

  select(actionId: string): void {
    const current = this.popoverState();

    if (!current) {
      return;
    }

    this.close();
    current.onSelect(actionId);
  }
}
