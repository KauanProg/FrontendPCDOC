import { Injectable, signal } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Movement } from '../models/products.models';
@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  readonly products = signal<Product[]>([]);
  readonly error = signal<string | null>(null);
  readonly movements = signal<Movement[]>([]);
  constructor(private readonly service: ProductsService) {}
  findAll() {
    this.error.set(null);
    return this.service.findAll().subscribe({
      next: (r) => this.products.set(r.content ?? r),
      error: () => { this.products.set([]); this.error.set('Não foi possível carregar os produtos da API.'); },
    });
  }
  save(p: Product) {
    return p.id ? this.service.update(p.id, p) : this.service.create(p);
  }
  delete(id: string) { return this.service.delete(id); }
  loadHistory(id: string) {
    return this.service
      .history(id)
      .subscribe({ next: (r) => this.movements.set(r), error: () => this.movements.set([]) });
  }
  movement(id: string, t: string, q: number) {
    return t === 'ENTRADA' ? this.service.buy(id, q) : this.service.sell(id, q);
  }
}
