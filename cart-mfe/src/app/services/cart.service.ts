import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Add item to cart
  addToCart(product: any): void {
    const currentCart = this.cartItemsSubject.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.total = existingItem.price * existingItem.quantity;
      existingItem.discountedTotal = existingItem.total * (1 - existingItem.discountPercentage / 100);
    } else {
      const newItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        total: product.price,
        discountPercentage: product.discountPercentage || 0,
        discountedTotal: product.price * (1 - (product.discountPercentage || 0) / 100),
        thumbnail: product.thumbnail
      };
      currentCart.push(newItem);
    }

    this.updateCart(currentCart);
  }

  // Update item quantity
  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartItemsSubject.value;
    const item = currentCart.find(i => i.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        item.total = item.price * quantity;
        item.discountedTotal = item.total * (1 - item.discountPercentage / 100);
        this.updateCart(currentCart);
      }
    }
  }

  // Remove item from cart
  removeFromCart(productId: number): void {
    const currentCart = this.cartItemsSubject.value.filter(item => item.id !== productId);
    this.updateCart(currentCart);
  }

  // Clear cart
  clearCart(): void {
    this.updateCart([]);
  }

  // Get cart total
  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.discountedTotal, 0);
  }

  // Get subtotal (before discounts)
  getSubtotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.total, 0);
  }

  // Get total discount
  getTotalDiscount(): number {
    return this.getSubtotal() - this.getCartTotal();
  }

  // Get cart count
  getCartCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  // Private helper to update cart and save to localStorage
  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.cartCountSubject.next(this.getCartCount());
    this.saveCartToStorage(items);
  }

  // Save to localStorage
  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  // Load from localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      this.cartItemsSubject.next(items);
      this.cartCountSubject.next(this.getCartCount());
    }
  }
}