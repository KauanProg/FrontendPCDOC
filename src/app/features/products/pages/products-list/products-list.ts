import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { SearchFieldComponent } from '../../../../shared/ui/forms/search-field/search-field';
import { TextFieldComponent } from '../../../../shared/ui/forms/text-field/text-field';
import { PopupComponent } from '../../../../shared/ui/overlays/popup/popup';
import { ProductsFacade } from '../../facade/products.facade';
import { Product } from '../../models/products.models';
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon, SearchFieldComponent, TextFieldComponent, PopupComponent],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsPage {
  facade = inject(ProductsFacade);
  searchForm = new FormGroup({ search: new FormControl('') });
  quantityForm = new FormGroup({ quantity: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }) });
  productForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    price: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    quantity: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
  });
  page = 1;
  readonly pageSize = 8;
  editing = false;
  movement: { product: Product; type: 'ENTRADA' | 'SAIDA' } | null = null;
  deleting: Product | null = null;
  get deleteMessage() { return this.deleting ? `Deseja excluir ${this.deleting.name}?` : ''; }
  form: Product = { name: '', description: '', price: 0, quantity: 0 };
  constructor() {
    this.facade.findAll();
  }
  filtered() {
    return this.facade
      .products()
      .filter((p) => p.name.toLowerCase().includes((this.searchForm.value.search ?? '').toLowerCase()));
  }
  open(p?: Product) {
    this.form = p ? { ...p } : { name: '', description: '', price: 0, quantity: 0 };
    this.productForm.reset({ name: this.form.name, description: this.form.description, price: this.form.price, quantity: this.form.quantity });
    this.editing = true;
  }
  save() {
    if (this.productForm.invalid) { this.productForm.markAllAsTouched(); return; }
    const values = this.productForm.getRawValue();
    this.facade.save({ ...this.form, name: values.name, description: values.description, price: Number(values.price), quantity: Number(values.quantity) }).subscribe(() => {
      this.editing = false;
      this.facade.findAll();
    });
  }
  rows() { const start = (this.page - 1) * this.pageSize; return this.filtered().slice(start, start + this.pageSize); }
  totalPages() { return Math.max(1, Math.ceil(this.filtered().length / this.pageSize)); }
  pages() { return Array.from({ length: this.totalPages() }, (_, index) => index + 1); }
  goToPage(page: number) { if (page >= 1 && page <= this.totalPages()) this.page = page; }
  remove(product: Product) { this.deleting = product; }
  confirmDelete() { const product = this.deleting; if (product?.id) this.facade.delete(product.id).subscribe(() => this.facade.findAll()); this.deleting = null; }
  buy(product: Product) { this.openMovement(product, 'ENTRADA'); }
  sell(product: Product) { this.openMovement(product, 'SAIDA'); }
  openMovement(product: Product, type: 'ENTRADA' | 'SAIDA') { this.quantityForm.reset({ quantity: 1 }); this.movement = { product, type }; }
  confirmMovement() { const current = this.movement; const quantity = this.quantityForm.value.quantity; if (current?.product.id && quantity && this.quantityForm.valid) this.facade.movement(current.product.id, current.type, quantity).subscribe(() => this.facade.findAll()); this.movement = null; }
}




