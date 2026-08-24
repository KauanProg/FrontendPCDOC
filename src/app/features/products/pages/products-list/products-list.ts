import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form } from '@angular/forms/signals';
import { NgIcon } from '@ng-icons/core';
import { PopupComponent } from '../../../../shared/ui/overlays/popup/popup';
import { SearchFieldComponent } from '../../../../shared/ui/forms/search-field/search-field';
import { TableComponent } from '../../../../shared/ui/data-display/table/table';
import { ProductsFacade } from '../../facade/products.facade';
import { Product } from '../../models/products.models';
import { MovementModalComponent, MovementRequest } from '../../components/movement-modal/movement-modal';
import { ProductModalComponent } from '../../components/product-modal/product-modal';
import { NotificationService } from '../../../../shared/ui/feedback/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { getApiErrorMessage } from '../../../../shared/utils/http-error.util';

@Component({
  standalone: true,
  imports: [CommonModule, FormField, NgIcon, PopupComponent, ProductModalComponent, MovementModalComponent, SearchFieldComponent, TableComponent],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsPage implements OnDestroy {
  facade = inject(ProductsFacade);
  private readonly notifications = inject(NotificationService);
  searchModel = signal({ search: '' });
  searchForm = form(this.searchModel);
  page = 1;
  sortKey: 'name' | 'price' | 'quantity' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
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
    this.editing = true;
  }

  save(product: Product) {
    this.facade.save(product).subscribe({
      next: () => {
        this.editing = false;
        this.loadProducts();
        this.notifications.success(
          product.id ? 'Produto atualizado com sucesso.' : 'Produto criado com sucesso.',
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
    this.movement = { product, type };
  }

  confirmMovement(request: MovementRequest) {
    this.facade.movement(request.productId, request.type, request.quantity).subscribe({
        next: () => {
          this.loadProducts();
          this.notifications.success(
            request.type === 'ENTRADA'
              ? 'Entrada registrada com sucesso.'
              : 'Venda registrada com sucesso.',
          );
          this.movement = null;
        },
        error: () => this.notifications.error('Não foi possível registrar a movimentação.'),
      });
  }
}

