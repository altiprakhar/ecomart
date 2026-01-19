import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product, ProductResponse, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com';
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(limit: number = 30, skip: number = 0): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products?limit=${limit}&skip=${skip}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching products:', error);
          throw error;
        })
      );
  }

  // Get single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching product:', error);
          throw error;
        })
      );
  }

  // Search products
  searchProducts(query: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/search?q=${query}`)
      .pipe(
        catchError(error => {
          console.error('Error searching products:', error);
          throw error;
        })
      );
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/category/${category}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching products by category:', error);
          throw error;
        })
      );
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/products/categories`)
      .pipe(
        catchError(error => {
          console.error('Error fetching categories:', error);
          throw error;
        })
      );
  }

  // Update search term
  updateSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }
}