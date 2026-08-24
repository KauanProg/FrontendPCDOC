import { Injectable, signal } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Movement, PageResponse } from '../models/products.models';
import { NotificationService } from '../../../shared/ui/feedback/notification/notification.service';
import { forkJoin, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  readonly products = signal<Product[]>([]);
  readonly error = signal<string | null>(null);
  readonly movements = signal<Movement[]>([]);
  readonly productsPage = signal<PageResponse<Product>>({
    content: [],
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });
  readonly movementsPage = signal<PageResponse<Movement>>({
    content: [],
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });
  constructor(
    private readonly service: ProductsService,
    private readonly notifications: NotificationService,
  ) {}
  findAll(page = 0, search = '', sort = 'createdAt', direction = 'desc') {
    this.error.set(null);
    const backendSort = sort === 'product' ? 'product.name' : sort;
    const params = new HttpParams()
      .set('page', page)
      .set('size', 12)
      .set('sort', `${backendSort},${direction}`)
      .set('search', search);
    return this.service.findAll(params).subscribe({
      next: (r) => {
        this.products.set(r.content);
        this.productsPage.set(r);
      },
      error: () => {
        this.products.set([]);
        this.error.set('Não foi possível carregar os produtos da API.');
        this.notifications.error('Não foi possível carregar os produtos.');
      },
    });
  }
  save(p: Product) {
    return p.id ? this.service.update(p.id, p) : this.service.create(p);
  }
  delete(id: string) {
    return this.service.delete(id);
  }
  loadHistory(id: string) {
    return this.service
      .history(id)
      .subscribe({ next: (r) => this.movements.set(r), error: () => this.movements.set([]) });
  }
  loadAllHistory(page = 0, search = '', sort = 'createdAt', direction = 'desc') {
    const backendSort = sort === 'product' ? 'product.name' : sort;
    const params = new HttpParams()
      .set('page', page)
      .set('size', 12)
      .set('sort', `${backendSort},${direction}`)
      .set('search', search);
    this.service.allHistory(params).subscribe({
      next: (response) => {
        this.movementsPage.set(response);
        this.movements.set(response.content);
        const ids = [...new Set(response.content.map((movement) => movement.productId))];
        const known = this.products();
        const missing = ids.filter((id) => !known.some((product) => product.id === id));
        (missing.length
          ? forkJoin(missing.map((id) => this.service.findById(id)))
          : of([])
        ).subscribe({
          next: (products) => this.products.set([...known, ...products]),
          error: () =>
            this.notifications.warning(
              'Não foi possível carregar o nome de alguns produtos do histórico.',
            ),
        });
      },
      error: () => {
        this.movements.set([]);
        this.notifications.error('Não foi possível carregar o histórico de movimentações.');
      },
    });
  }
  movement(id: string, t: string, q: number) {
    return t === 'ENTRADA' ? this.service.buy(id, q) : this.service.sell(id, q);
  }
}
