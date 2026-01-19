//  product-list.component.ts
import { Component, OnInit, OnDestroy,ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Category, Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategory: string = 'all';
  searchTerm: string = '';
  sortBy: string = 'default';
  loading: boolean = false;
  error: string = '';

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getProducts(100, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.products = response.products;
          this.filteredProducts = [...this.products];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.error = 'Failed to load products. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
          console.error('Error loading products:', error);
        }
      });
  }

  loadCategories(): void {
    this.productService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        if (searchTerm.trim()) {
          this.performSearch(searchTerm);
        } else {
          this.loadProducts();
        }
      });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  performSearch(query: string): void {
    this.loading = true;
    this.productService.searchProducts(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.filteredProducts = response.products;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Search failed. Please try again.';
          this.loading = false;
        }
      });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.loading = true;
    this.searchTerm = '';
    if (category === 'all') {
        
      this.loadProducts();
    } else {
      this.productService.getProductsByCategory(category)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.filteredProducts = response.products;
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Failed to load category products.';
            this.loading = false;
          }
        });
    }
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.applySorting();
  }

  applySorting(): void {
    switch (this.sortBy) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        this.filteredProducts = [...this.products];
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.title} added to cart!`);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}