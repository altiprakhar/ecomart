import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shell';
  cartCount: number = 0;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Listen to localStorage changes for cart count
    this.updateCartCount();
    
    // Update cart count every second (simple polling)
    setInterval(() => {
      this.updateCartCount();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateCartCount(): void {
    const cart = localStorage.getItem('cart');
    if (cart) {
      const items = JSON.parse(cart);
      this.cartCount = items.reduce((count: number, item: any) => count + item.quantity, 0);
    } else {
      this.cartCount = 0;
    }
  }
}