import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

/**
 * Representa erros básicos de validação para campos de texto.
 */
type SimpleTextError = {
  required?: true;
  minlength?: { requiredLength: number; actualLength: number };
};

/**
 * Componente reutilizável de campo de horário com controles nativos.
 *
 * ## 📌 Funcionalidades
 * - Integração com Reactive Forms
 * - Seleção de horário via Timepicker
 * - Suporte a desabilitar campo
 * - Uso de adapter nativo para manipulação de datas/horas
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
 * <app-time-field
 *   [form]="form"
 *   controlName="startTime"
 *   label="Horário de início"
 *   placeholder="Selecione um horário"
 * />
 * ```
 */
@Component({
  selector: 'app-time-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './time-field.html',
  styleUrl: './time-field.scss',
})
export class TimeFieldComponent implements OnChanges {
  /**
   * Formulário reativo que contém o controle
   */
  @Input() form!: FormGroup;

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
  @Input() disabled = false;

  get displayLabel(): string {
    return this.label.replace(/\s*\*+\s*$/g, '').trim();
  }

  get fieldPlaceholder(): string {
    return this.placeholder || this.displayLabel;
  }

  get showRequiredMarker(): boolean {
    const control = this.form?.get(this.controlName);

    return this.label.includes('*') || !!control?.hasValidator?.(Validators.required);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['disabled']) {
      return;
    }

    const control = this.form?.get(this.controlName);

    if (!control) {
      return;
    }

    this.disabled
      ? control.disable({ emitEvent: false })
      : control.enable({ emitEvent: false });
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
    const control = this.form.get(this.controlName);

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }

    const errors = control.errors as SimpleTextError & Record<string, unknown>;

    if (errors['required']) {
      return 'Este campo é obrigatório';
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `Mínimo de ${requiredLength} caracteres`;
    }

    return 'Valor inválido';
  }
}
