import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, input, model, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { NgIcon } from '@ng-icons/core';

/**
 * Representa erros básicos de validação para campos de texto.
 */
/**
 * Componente reutilizável de campo de data com controles nativos.
 *
 * ## 📌 Funcionalidades
 * - Integração com Reactive Forms
 * - Seleção de data via Datepicker
 * - Suporte a desabilitar campo
 * - Exibição automática de mensagens de erro
 *
 * ## 📥 Inputs
 *
 * | Nome         | Tipo        | Obrigatório | Descrição |
 * |--------------|------------|------------|----------|
 * | `form`       | FormGroup  | ✔️ Sim     | Formulário reativo que contém o controle |
 * | `controlName`| string     | ✔️ Sim     | Nome do FormControl dentro do FormGroup |
 * | `label`      | string     | ❌ Não     | Label exibida acima do campo |
 * | `placeholder`| string     | ❌ Não     | Placeholder do input (fallback: usa label) |
 * | `disabled`   | boolean    | ❌ Não     | Define se o campo estará desabilitado |
 *
 * ## 💡 Exemplo de uso
 *
 * ```html
 * <app-date-field
 *   [form]="form"
 *   controlName="birthDate"
 *   label="Data de nascimento"
 *   placeholder="Selecione uma data"
 * />
 * ```
 */
@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon],
  templateUrl: './date-field.html',
  styleUrl: './date-field.scss',
})
export class DateFieldComponent implements FormValueControl<Date | null> {
  @ViewChild('dateInput') private dateInput?: ElementRef<HTMLInputElement>;

  readonly value = model<Date | null>(null);
  readonly disabled = input(false);
  readonly required = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly touched = input(false);
  readonly dirty = input(false);
  readonly touch = output<void>();

  /**
   * Formulário reativo que contém o controle
   */
  /**
   * Nome do FormControl dentro do FormGroup
   */
  @Input() controlName!: string;

  /**
   * Label exibida acima do campo
   */
  @Input() label = '';

  /**
   * Placeholder do input
   */
  @Input() placeholder = '';

  /**
   * Define se o campo estará desabilitado
   */
  @Input() subscriptSizing: 'fixed' | 'dynamic' = 'fixed';

  get displayLabel(): string {
    return this.label.replace(/\s*\*+\s*$/g, '').trim();
  }

  get fieldPlaceholder(): string {
    return this.placeholder || this.displayLabel;
  }

  get showRequiredMarker(): boolean {
    return this.label.includes('*') || this.required();
  }

  get nativeDateValue(): string {
    const value = this.value();

    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get controlDisabled(): boolean {
    return this.disabled();
  }

  /**
   * Retorna a mensagem de erro baseada nas validações do FormControl.
   *
   * 🔹 Regras:
   * - required → "Este campo é obrigatório"
   * - fallback → "Valor inválido"
   *
   * @returns string | null
   */
  getErrorMessage(): string | null {
    if (!(this.touched() || this.dirty())) {
      return null;
    }

    const error = this.errors()[0];
    return error?.message ?? (error ? 'Valor inválido' : null);
  }

  protected onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.value) {
      this.value.set(null);
    } else {
      const [year, month, day] = input.value.split('-').map(Number);
      this.value.set(new Date(year, month - 1, day));
    }

    this.touch.emit();
  }

  protected openDatePicker(): void {
    const input = this.dateInput?.nativeElement;

    if (!input || input.disabled) {
      return;
    }

    input.focus();

    const picker = (input as HTMLInputElement & { showPicker?: () => void }).showPicker;

    if (picker) {
      picker.call(input);
      return;
    }

    input.click();
  }
}
