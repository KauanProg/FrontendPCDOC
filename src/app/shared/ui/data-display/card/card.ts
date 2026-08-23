import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly valueSuffix = input<string | null>(null);
  readonly iconName = input<string>('phosphorQuestion');
  readonly highlighted = input<boolean>(false);
  readonly compactValue = input<boolean>(false);
  readonly secondaryLabel = input<string | null>(null);
  readonly showSecondaryLabel = input<boolean>(false);
}
