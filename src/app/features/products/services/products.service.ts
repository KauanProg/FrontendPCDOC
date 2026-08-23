import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, Movement } from '../models/products.models';
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly api = '/api/v1/products';
  constructor(private readonly http: HttpClient) {}
  findAll() {
    return this.http.get<any>(this.api);
  }
  create(data: Product) {
    return this.http.post<Product>(this.api, data);
  }
  update(id: string, data: Product) {
    return this.http.put<Product>(`${this.api}/${id}`, data);
  }
  delete(id: string) { return this.http.patch<void>(`${this.api}/${id}/delete`, null); }
  buy(id: string, q: number) {
    return this.http.post<Movement>(`${this.api}/${id}/comprar`, { quantity: q });
  }
  sell(id: string, q: number) {
    return this.http.post<Movement>(`${this.api}/${id}/vender`, { quantity: q });
  }
  history(id: string) {
    return this.http.get<Movement[]>(`${this.api}/${id}/historico-vendas`);
  }
}
