import { CommonModule } from '@angular/common';
import { Component, Input, input, model, output } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';

/**
 * Componente reutilizável de campo de texto com controles nativos.
 *
 * ## 📌 Funcionalidades
 * - Integração com Reactive Forms
 * - Ícones prefixo e sufixo
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
 * | `mask`       | string     | ❌ Não     | Máscara do campo (ex: CPF) |
 * | `prefixIcon` | string     | ❌ Não     | Ícone exibido no início do campo |
 * | `suffixIcon` | string     | ❌ Não     | Ícone exibido no final do campo |
 *
 * ## 💡 Exemplo de uso
 *
 * ```html
 * <app-text-field
 *   [form]="form"
 *   controlName="cpf"
 *   label="CPF"
 *   placeholder="Digite seu CPF"
 *   [mask]="'000.000.000-00'"
 *   prefixIcon="person"
 * />
 * ```
 */
@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
})
export class TextFieldComponent implements FormValueControl<unknown> {
  readonly value = model<unknown>('');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly touched = input(false);
  readonly dirty = input(false);
  readonly numericOnly = input(false);
  readonly touch = output<void>();
  readonly inputChange = output<string>();

  /**
   * Formulário reativo que contém o controle
   */
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
  /**
   * Máscara do campo (ex: '000.000.000-00' para CPF)
   */
  @Input() prefix = '';

  @Input() suffix = '';

  @Input() thousandSeparator = ' ';

  @Input() decimalMarker: '.' | ',' | ['.', ','] = ['.', ','];

  @Input() dropSpecialCharacters: boolean | string[] = true;

  /**
   * Ícone exibido no início do campo (prefixo)
   */
  @Input() prefixIcon?: string;

  /**
   * Ícone exibido no final do campo (sufixo)
   */
  @Input() suffixIcon?: string;

  @Input() subscriptSizing: 'fixed' | 'dynamic' = 'fixed';

  get displayLabel(): string {
    return this.label.replace(/\s*\*+\s*$/g, '').trim();
  }

  get fieldPlaceholder(): string {
    return this.placeholder || this.displayLabel;
  }

  get shouldUseNumericOnly(): boolean {
    return this.numericOnly();
  }

  get showRequiredMarker(): boolean {
    return this.label.includes('*') || this.required();
  }

  /**
   * Retorna a mensagem de erro baseada nas validações do FormControl.
   *
   * 🔹 Regras:
   * - required → "Este campo é obrigatório"
   * - minlength → "Mínimo de X caracteres"
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

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = this.shouldUseNumericOnly ? input.value.replace(/\D/g, '') : input.value;
    const nextValue = this.shouldUseNumericOnly && rawValue !== '' ? Number(rawValue) : rawValue;
    this.value.set(nextValue);
    this.inputChange.emit(rawValue);
  }

  protected onSignalBlur(): void {
    this.touch.emit();
  }

}
