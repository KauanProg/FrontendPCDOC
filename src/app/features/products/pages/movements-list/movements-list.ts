import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsFacade } from '../../facade/products.facade';
import { NotificationService } from '../../../../shared/ui/feedback/notification/notification.service';
import { MovementModalComponent, MovementRequest } from '../../components/movement-modal/movement-modal';
import { TableComponent } from '../../../../shared/ui/data-display/table/table';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MovementModalComponent, TableComponent],
  templateUrl: './movements-list.html',
  styleUrl: './movements-list.css',
})
export class MovementsPage {
  facade = inject(ProductsFacade);
  private readonly notifications = inject(NotificationService);
  showModal = false;
  page = 1;
  sortKey: 'product' | 'type' | 'quantity' | 'unitPrice' | 'total' | 'createdAt' = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor() {
    this.loadMovements();
  }

  loadMovements() {
    this.facade.loadAllHistory(this.page - 1, '', this.sortKey, this.sortDirection);
  }

  rows() {
    return this.facade.movements();
  }

  totalPages() {
    return Math.max(1, this.facade.movementsPage().totalPages);
  }

  pages() {
    const total = this.totalPages();
    const start = Math.floor((this.page - 1) / 5) * 5 + 1;
    return Array.from({ length: Math.min(5, total - start + 1) }, (_, index) => start + index);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.page = page;
      this.loadMovements();
    }
  }

  toggleSort(key: 'product' | 'type' | 'quantity' | 'unitPrice' | 'total' | 'createdAt') {
    if (this.sortKey === key) this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.page = 1;
    this.loadMovements();
  }

  sortIndicator(key: 'product' | 'type' | 'quantity' | 'unitPrice' | 'total' | 'createdAt') {
    return this.sortKey === key ? (this.sortDirection === 'asc' ? '↑' : '↓') : '↕';
  }

  totalStock() {
    return this.facade.products().reduce((sum, p) => sum + p.quantity, 0);
  }

  openMovement() {
    this.showModal = true;
  }

  submit(request: MovementRequest) {
    this.facade.movement(request.productId, request.type, request.quantity).subscribe({
      next: () => {
        this.showModal = false;
        this.loadMovements();
        this.notifications.success(
          request.type === 'ENTRADA'
            ? 'Entrada registrada com sucesso.'
            : 'Venda registrada com sucesso.',
        );
      },
      error: () => this.notifications.error('Não foi possível registrar a movimentação.'),
    });
  }
}

