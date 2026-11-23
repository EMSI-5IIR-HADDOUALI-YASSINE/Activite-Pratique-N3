import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  price: number;
  selected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private host: string = 'http://localhost:8083';

  constructor(private http: HttpClient) {}

  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.host}/products`);
  }

  public deleteProduct(p: Product): Observable<any> {
    return this.http.delete(`${this.host}/products/${p.id}`);
  }

  public addProduct(p: Product): Observable<Product> {
    return this.http.post<Product>(`${this.host}/products`, p);
  }

  public toggleSelected(p: Product): Observable<Product> {
    return this.http.put<Product>(`${this.host}/products/${p.id}`, { ...p, selected: !p.selected });
  }
}
