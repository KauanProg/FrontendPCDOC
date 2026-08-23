import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormValueControl, ValidationError } from '@angular/forms/signals';

export type FloatLabelType = 'always' | 'auto';

export type SelectOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
  iconPath?: string;
  iconSize?: number;
};

export type SelectOptionDisplay = 'label' | 'icon' | 'icon-grid';
export type SelectFieldValue = string | number | readonly (string | number)[];

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-field.html',
  styleUrls: ['./select-field.scss'],
})
export class SelectFieldComponent implements FormValueControl<SelectFieldValue>, OnDestroy {
  private static activeSelect: SelectFieldComponent | null = null;
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly value = model<SelectFieldValue>('');
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
  @Input() options: readonly SelectOption[] = [];
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() floatLabel: FloatLabelType = 'always';
  @Input() optionDisplay: SelectOptionDisplay = 'label';
  @Input() showSelectedIconPreview = false;
  @Input() multiple = false;
  @Input() panelClass?: string | readonly string[];
  @Input() subscriptSizing: 'fixed' | 'dynamic' = 'fixed';
  protected isOpen = false;
  protected panelPosition = {
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 280,
  };

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

  getErrorMessage(): string | null {
    const control = this.form?.get(this.controlName);

    if (control) {
      if (!control.errors || !(control.touched || control.dirty)) {
        return null;
      }

      if (control.errors['required']) {
        return 'Este campo é obrigatório';
      }

      return 'Valor inválido';
    }

    if (!(this.touched() || this.dirty())) {
      return null;
    }

    const value = this.currentValue;
    const hasValue = Array.isArray(value)
      ? value.length > 0
      : value !== null && value !== undefined && String(value).trim().length > 0;

    if (!hasValue && (this.required() || this.label.includes('*'))) {
      return 'Este campo é obrigatório';
    }

    const error = this.errors()[0];
    return error?.message ?? (error ? 'Valor inválido' : null);
  }

  getSelectedOption(): SelectOption | undefined {
    const value = this.currentValue;

    return this.options.find((option) => String(option.value) === String(value));
  }

  getSelectedOptions(): SelectOption[] {
    const value = this.currentValue;

    if (!Array.isArray(value)) {
      const selectedOption = this.getSelectedOption();

      return selectedOption ? [selectedOption] : [];
    }

    return this.options.filter((option) =>
      value.some((selectedValue) => String(selectedValue) === String(option.value)),
    );
  }

  getSelectedLabel(): string {
    if (!this.multiple) {
      return this.getSelectedOption()?.label ?? '';
    }

    const selectedOptions = this.getSelectedOptions();

    if (selectedOptions.length === 0) {
      return '';
    }

    if (selectedOptions.length === 1) {
      return selectedOptions[0].label;
    }

    return `${selectedOptions[0].label} +${selectedOptions.length - 1}`;
  }

  get controlDisabled(): boolean {
    return this.form ? !!this.form.get(this.controlName)?.disabled : this.disabled();
  }

  private get currentValue(): SelectFieldValue {
    return this.form?.get(this.controlName)?.value ?? this.value();
  }

  private updateValue(value: SelectFieldValue): void {
    const control = this.form?.get(this.controlName);

    if (control) {
      control.setValue(value);
      control.markAsDirty();
      control.markAsTouched();
      return;
    }

    this.value.set(value);
    this.touch.emit();
  }

  getPanelClass(): string[] {
    const classes: string[] = [];

    if (this.panelClass) {
      classes.push(...(Array.isArray(this.panelClass) ? this.panelClass : [this.panelClass]));
    }

    if (this.optionDisplay === 'icon-grid') {
      classes.push('select-field-icon-grid-panel');
    }

    if (this.multiple) {
      classes.push('select-field-panel--multiple');
    }

    return classes;
  }

  getOptionIconPath(option: SelectOption): string {
    return option.iconPath ?? option.value.toString();
  }

  removeSelectedOption(value: string | number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const currentValue = this.currentValue;

    if (!Array.isArray(currentValue)) {
      return;
    }

    this.updateValue(currentValue.filter((item) => String(item) !== String(value)));
  }

  protected toggleDropdown(event?: Event): void {
    event?.stopPropagation();

    if (this.controlDisabled) {
      return;
    }

    if (this.isOpen) {
      this.closeDropdown();
      return;
    }

    SelectFieldComponent.activeSelect?.closeDropdown();
    SelectFieldComponent.activeSelect = this;
    this.isOpen = true;

    this.positionPanel();
  }

  protected selectOption(option: SelectOption, event: Event): void {
    event.stopPropagation();

    if (option.disabled) {
      return;
    }

    if (this.multiple) {
      const currentValue = Array.isArray(this.currentValue) ? this.currentValue : [];
      const selected = currentValue.some((item) => String(item) === String(option.value));
      this.updateValue(
        selected
          ? currentValue.filter((item) => String(item) !== String(option.value))
          : [...currentValue, option.value],
      );
    } else {
      this.updateValue(option.value);
      this.closeDropdown();
    }
  }

  protected isOptionSelected(option: SelectOption): boolean {
    return this.getSelectedOptions().some(
      (selected) => String(selected.value) === String(option.value),
    );
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      this.toggleDropdown(event);
      return;
    }

    if (event.key === 'Escape') {
      this.closeDropdown();
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    if (this.isOpen) {
      this.positionPanel();
    }
  }

  @HostListener('document:scroll')
  protected onDocumentScroll(): void {
    if (this.isOpen) {
      this.positionPanel();
    }
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    if (this.isOpen) {
      this.positionPanel();
    }
  }

  ngOnDestroy(): void {
    if (SelectFieldComponent.activeSelect === this) {
      SelectFieldComponent.activeSelect = null;
    }
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.changeDetector.markForCheck();
    if (SelectFieldComponent.activeSelect === this) {
      SelectFieldComponent.activeSelect = null;
    }
  }

  private positionPanel(): void {
    const hostElement = this.elementRef.nativeElement as HTMLElement;
    const trigger = hostElement.querySelector(
      '.ui-field__select-button',
    ) as HTMLElement | null;

    if (!trigger) {
      return;
    }

    const bounds = trigger.getBoundingClientRect();
    const viewportPadding = 12;
    const optionPanelGap = 6;
    const availableBelow = window.innerHeight - bounds.bottom - viewportPadding;
    const maxHeight = Math.max(
      120,
      Math.min(280, availableBelow),
    );
    const left = Math.min(
      Math.max(viewportPadding, bounds.left),
      Math.max(viewportPadding, window.innerWidth - bounds.width - viewportPadding),
    );

    this.panelPosition = {
      top: bounds.bottom + optionPanelGap,
      left,
      width: bounds.width,
      maxHeight,
    };
  }
}
