import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';

export type FloatLabelType = 'always' | 'auto';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon],
  templateUrl: './search-field.html',
  styleUrl: './search-field.scss',
})
export class SearchFieldComponent implements OnChanges {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() prefixIcon = 'phosphorMagnifyingGlass';
  @Input() suffixIcon?: string;
  @Input() floatLabel: FloatLabelType = 'always';

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

    this.disabled ? control.disable({ emitEvent: false }) : control.enable({ emitEvent: false });
  }

  getErrorMessage(): string | null {
    const control = this.form.get(this.controlName);

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }

    if (control.errors['required']) {
      return 'Este campo e obrigatorio';
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Minimo de ${requiredLength} caracteres`;
    }

    return 'Valor invalido';
  }
}
