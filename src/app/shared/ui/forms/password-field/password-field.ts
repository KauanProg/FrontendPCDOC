import { CommonModule } from '@angular/common';
import { Component, Input, input, model, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { NgIcon } from '@ng-icons/core';

type SimpleTextError = {
  required?: true;
  minlength?: { requiredLength: number; actualLength: number };
};

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon],
  templateUrl: './password-field.html',
  styleUrl: './password-field.scss',
})
export class PasswordFieldComponent implements FormValueControl<string> {
  readonly value = model('');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly touched = input(false);
  readonly dirty = input(false);
  readonly touch = output<void>();

  @Input() form?: FormGroup;
  @Input() controlName!: string;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() subscriptSizing: 'fixed' | 'dynamic' = 'fixed';
  @Input() prefixIcon?: string;
  @Input() showPasswordIcon = 'phosphorEye';
  @Input() hidePasswordIcon = 'phosphorEyeSlash';

  isPasswordHidden = true;

  get displayLabel(): string {
    return this.label.replace(/\s*\*+\s*$/g, '').trim();
  }

  get fieldPlaceholder(): string {
    return this.placeholder || this.displayLabel;
  }

  get showRequiredMarker(): boolean {
    const control = this.form?.get(this.controlName);

    return (
      this.label.includes('*') || this.required() || !!control?.hasValidator?.(Validators.required)
    );
  }

  toggleVisibility(): void {
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  getErrorMessage(): string | null {
    const control = this.form?.get(this.controlName);

    if (!control) {
      if (!(this.touched() || this.dirty())) {
        return null;
      }

      const error = this.errors()[0];
      return error?.message ?? (error ? 'Valor inválido' : null);
    }

    if (!control.errors || !(control.touched || control.dirty)) {
      return null;
    }

    const errors = control.errors as SimpleTextError & Record<string, unknown>;

    if (errors['required']) {
      return 'Este campo é obrigatório';
    }

    if (errors['minlength']) {
      return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    }

    return 'Valor inválido';
  }

  protected onSignalInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected onSignalBlur(): void {
    this.touch.emit();
  }

  protected get isDisabled(): boolean {
    return this.form ? !!this.form.get(this.controlName)?.disabled : this.disabled();
  }
}
