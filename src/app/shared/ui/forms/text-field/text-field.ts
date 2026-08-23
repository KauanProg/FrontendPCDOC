import { CommonModule } from '@angular/common';
import { Component, Input, input, model, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { NgxMaskDirective } from 'ngx-mask';

/**
 * Componente reutilizável de campo de texto com controles nativos.
 *
 * ## 📌 Funcionalidades
 * - Integração com Reactive Forms
 * - Suporte a máscaras (ngx-mask)
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
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
})
export class TextFieldComponent implements FormValueControl<string> {
  readonly value = model('');
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
  @Input() form?: FormGroup;

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
  /**
   * Máscara do campo (ex: '000.000.000-00' para CPF)
   */
  @Input() mask?: string;

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
    return this.numericOnly() || this.controlName === 'number' || this.controlName === 'cpfCnpj';
  }

  get showRequiredMarker(): boolean {
    const control = this.form?.get(this.controlName);

    return (
      this.label.includes('*') || this.required() || !!control?.hasValidator?.(Validators.required)
    );
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
    const control = this.form?.get(this.controlName);

    if (!control) {
      if (!(this.touched() || this.dirty())) {
        return null;
      }

      const error = this.errors()[0];
      return error?.message ?? (error ? 'Valor inválido' : null);
    }

    // Se não existir controle ou não houver erro, não mostra mensagem
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }

    // Campo obrigatório
    if (control.errors['required']) {
      return 'Este campo é obrigatório';
    }

    // Validação de tamanho mínimo
    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Mínimo de ${requiredLength} caracteres`;
    }

    // Erro genérico
    return 'Valor inválido';
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = this.shouldUseNumericOnly ? input.value.replace(/\D/g, '') : input.value;

    if (input.value !== value) {
      input.value = value;
    }

    const control = this.form?.get(this.controlName);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
    } else {
      this.value.set(value);
    }

    this.inputChange.emit(value);
  }

  protected onSignalBlur(): void {
    this.touch.emit();
  }

  protected get isDisabled(): boolean {
    return this.form ? !!this.form.get(this.controlName)?.disabled : this.disabled();
  }
}
