import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormField, form, min, required } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { TextFieldComponent } from '../../../../shared/ui/forms/text-field/text-field';
import { Product } from '../../models/products.models';

export type MovementType = 'ENTRADA' | 'SAIDA';
export interface MovementRequest {
  productId: string;
  type: MovementType;
  quantity: number;
}

@Component({
  selector: 'app-movement-modal',
  standalone: true,
  imports: [CommonModule, FormField, FormsModule, TextFieldComponent],
  templateUrl: './movement-modal.html',
  styleUrl: './movement-modal.css',
})
export class MovementModalComponent implements OnChanges {
  @Input() open = false;
  @Input() products: Product[] = [];
  @Input() product: Product | null = null;
  @Input() type: MovementType = 'ENTRADA';
  @Input() quick = false;
  @Output() confirmed = new EventEmitter<MovementRequest>();
  @Output() cancelled = new EventEmitter<void>();

  selectedProduct = '';
  quantity = 1;
  quantityModel = signal({ quantity: 1 });
  quantityForm = form(this.quantityModel, (schemaPath) => {
    required(schemaPath.quantity, { message: 'Informe a quantidade' });
    min(schemaPath.quantity, 1, { message: 'A quantidade deve ser maior que zero' });
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']?.currentValue) {
      this.selectedProduct = this.product?.id ?? '';
      this.quantity = 1;
      this.quantityModel.set({ quantity: 1 });
      this.quantityForm().reset();
    }
  }

  confirm() {
    const quantity = this.quick ? this.quantityModel().quantity : this.quantity;
    if (!this.selectedProduct || quantity < 1) {
      if (this.quick) this.quantityForm().markAsTouched();
      return;
    }
    this.confirmed.emit({
      productId: this.selectedProduct,
      type: this.type,
      quantity,
    });
  }
}
