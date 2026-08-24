import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-field.html',
  styleUrl: './search-field.scss',
})
export class SearchFieldComponent implements FormValueControl<string> {
  readonly value = model('');
  readonly disabled = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly touched = input(false);
  readonly dirty = input(false);
  readonly touch = output<void>();
  readonly inputChange = output<string>();

  placeholder = 'Buscar';

  protected onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.inputChange.emit(value);
  }

  protected onBlur() {
    this.touch.emit();
  }
}
