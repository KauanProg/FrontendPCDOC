import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, min, required } from '@angular/forms/signals';
import { NgIcon } from '@ng-icons/core';
import { TextFieldComponent } from '../../../../shared/ui/forms/text-field/text-field';
import { PopupComponent } from '../../../../shared/ui/overlays/popup/popup';
import { ProductsFacade } from '../../facade/products.facade';
import { Product } from '../../models/products.models';
import { NotificationService } from '../../../../shared/ui/feedback/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { getApiErrorMessage } from '../../../../shared/utils/http-error.util';

@Component({
  standalone: true,
  imports: [CommonModule, FormField, NgIcon, TextFieldComponent, PopupComponent],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsPage implements OnDestroy {
  facade = inject(ProductsFacade);
  private readonly notifications = inject(NotificationService);
  searchModel = signal({ search: '' });
  searchForm = form(this.searchModel);
  quantityModel = signal({ quantity: 1 });
  quantityForm = form(this.quantityModel, (schemaPath) => {
    required(schemaPath.quantity, { message: 'Informe a quantidade' });
    min(schemaPath.quantity, 1, { message: 'A quantidade deve ser maior que zero' });
  });
  productModel = signal({ name: '', description: '', price: 0, quantity: 0 });
  productForm = form(this.productModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Informe o nome' });
    required(schemaPath.price, { message: 'Informe o preço' });
    min(schemaPath.price, 0, { message: 'O preço não pode ser negativo' });
    required(schemaPath.quantity, { message: 'Informe a quantidade' });
    min(schemaPath.quantity, 0, { message: 'A quantidade não pode ser negativa' });
  });
  page = 1;
  sortKey: 'name' | 'price' | 'quantity' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  readonly pageSize = 12;
  editing = false;
  movement: { product: Product; type: 'ENTRADA' | 'SAIDA' } | null = null;
  deleting: Product | null = null;
  form: Product = { name: '', description: '', price: 0, quantity: 0 };
  private searchDebounce?: ReturnType<typeof setTimeout>;

  constructor() {
    this.loadProducts();
  }

  ngOnDestroy() {
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }
  }

  loadProducts() {
    this.facade.findAll(this.page - 1, this.searchModel().search, this.sortKey, this.sortDirection);
  }

  onSearch() {
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }

    this.searchDebounce = setTimeout(() => {
      this.page = 1;
      this.loadProducts();
      this.searchDebounce = undefined;
    }, 400);
  }

  open(p?: Product) {
    this.form = p ? { ...p } : { name: '', description: '', price: 0, quantity: 0 };
    this.productModel.set({
      name: this.form.name,
      description: this.form.description,
      price: this.form.price,
      quantity: this.form.quantity,
    });
    this.productForm().reset();
    this.editing = true;
  }

  save() {
    if (this.productForm().invalid()) {
      this.productForm().markAsTouched();
      return;
    }
    const values = this.productModel();
    this.facade.save({ ...this.form, ...values }).subscribe({
      next: () => {
        this.editing = false;
        this.loadProducts();
        this.notifications.success(
          this.form.id ? 'Produto atualizado com sucesso.' : 'Produto criado com sucesso.',
        );
      },
      error: (error: HttpErrorResponse) =>
        this.notifications.error(getApiErrorMessage(error, 'Não foi possível salvar o produto.')),
    });
  }

  rows() {
    return this.facade.products();
  }

  toggleSort(key: 'name' | 'price' | 'quantity') {
    if (this.sortKey === key) this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.page = 1;
    this.loadProducts();
  }

  sortIndicator(key: 'name' | 'price' | 'quantity') {
    return this.sortKey === key ? (this.sortDirection === 'asc' ? '↑' : '↓') : '↕';
  }

  totalPages() {
    return Math.max(1, this.facade.productsPage().totalPages);
  }

  pages() {
    const total = this.totalPages();
    const start = Math.floor((this.page - 1) / 5) * 5 + 1;
    return Array.from({ length: Math.min(5, total - start + 1) }, (_, index) => start + index);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.page = page;
      this.loadProducts();
    }
  }

  remove(product: Product) {
    this.deleting = product;
  }

  confirmDelete() {
    const product = this.deleting;
    if (product?.id)
      this.facade.delete(product.id).subscribe({
        next: () => {
          this.loadProducts();
          this.notifications.success('Produto excluído com sucesso.');
        },
        error: () => this.notifications.error('Não foi possível excluir o produto.'),
      });
    this.deleting = null;
  }

  buy(product: Product) {
    this.openMovement(product, 'ENTRADA');
  }

  sell(product: Product) {
    this.openMovement(product, 'SAIDA');
  }

  openMovement(product: Product, type: 'ENTRADA' | 'SAIDA') {
    this.quantityModel.set({ quantity: 1 });
    this.quantityForm().reset();
    this.movement = { product, type };
  }

  confirmMovement() {
    const current = this.movement;
    const quantity = this.quantityModel().quantity;
    if (current?.product.id && quantity && this.quantityForm().valid())
      this.facade.movement(current.product.id, current.type, quantity).subscribe({
        next: () => {
          this.loadProducts();
          this.notifications.success(
            current.type === 'ENTRADA'
              ? 'Entrada registrada com sucesso.'
              : 'Venda registrada com sucesso.',
          );
        },
        error: () => this.notifications.error('Não foi possível registrar a movimentação.'),
      });
    else this.quantityForm().markAsTouched();
    this.movement = null;
  }
}

