import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import {
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { ConnectedPosition, Overlay, OverlayModule } from '@angular/cdk/overlay';
import { ActionPopoverService } from './action-popover.service';

@Component({
  selector: 'app-action-popover',
  standalone: true,
  imports: [CommonModule, NgIcon, OverlayModule],
  templateUrl: './action-popover.html',
  styleUrl: './action-popover.scss',
})
export class ActionPopoverComponent {
  protected readonly actionPopover = inject(ActionPopoverService);
  private readonly overlay = inject(Overlay);

  protected readonly scrollStrategy = this.overlay.scrollStrategies.reposition();
  protected readonly positions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -8,
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -8,
    },
  ];

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.actionPopover.close();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.actionPopover.close();
  }
}
