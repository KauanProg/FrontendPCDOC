import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TagVariant =
  | 'default'
  | 'superuser'
  | 'admin'
  | 'employee'
  | 'focal-point'
  | 'auditor'
  | 'active'
  | 'inactive';

export type TagKind = 'default' | 'permission' | 'status';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag.html',
  styleUrl: './tag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly label = input.required<string>();
  readonly kind = input<TagKind>('default');
  readonly variant = input<TagVariant>('default');
}
