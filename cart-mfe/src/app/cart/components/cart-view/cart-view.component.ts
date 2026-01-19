import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../models/cart.model';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss']
})
export class CartViewComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  discount: number = 0;
  tax: number = 0;
  shipping: number = 0;
  total: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        this.calculateTotals();
      });
  }

  calculateTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.discount = this.cartService.getTotalDiscount();
    this.tax = this.subtotal * 0.08; // 8% tax
    this.shipping = this.cartItems.length > 0 ? 10 : 0; // $10 flat shipping
    this.total = this.subtotal - this.discount + this.tax + this.shipping;
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.cartService.updateQuantity(item.id, newQuantity);
    }
  }

  removeItem(itemId: number): void {
    if (confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeFromCart(itemId);
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear the entire cart?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    this.router.navigate(['/cart/checkout']);
  }

  continueShopping(): void {
   // this.router.navigate(['/products']);
   // Check if running standalone or in shell
  if (window.location.port === '4201') {
    // Running standalone - open shell in new tab or redirect
    window.location.href = 'http://localhost:4202/products';
  } else {
    // Running in shell - use router
    this.router.navigate(['/products']);
  }
  }
}