import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormField, form, min, required } from '@angular/forms/signals';
import { TextFieldComponent } from '../../../../shared/ui/forms/text-field/text-field';
import { Product } from '../../models/products.models';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormField, TextFieldComponent],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.css',
})
export class ProductModalComponent implements OnChanges {
  @Input() open = false;
  @Input() product: Product | null = null;
  @Output() saved = new EventEmitter<Product>();
  @Output() cancelled = new EventEmitter<void>();

  model = signal({ name: '', description: '', price: 0, quantity: 0 });
  productForm = form(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Informe o nome' });
    required(schemaPath.price, { message: 'Informe o preço' });
    min(schemaPath.price, 0, { message: 'O preço não pode ser negativo' });
    required(schemaPath.quantity, { message: 'Informe a quantidade' });
    min(schemaPath.quantity, 0, { message: 'A quantidade não pode ser negativa' });
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']?.currentValue || changes['product']) {
      const product = this.product ?? { name: '', description: '', price: 0, quantity: 0 };
      this.model.set({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
      });
      this.productForm().reset();
    }
  }

  save() {
    if (this.productForm().invalid()) {
      this.productForm().markAsTouched();
      return;
    }

    this.saved.emit({ ...(this.product ?? {}), ...this.model() });
  }
}
