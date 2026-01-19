import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CartItem, CheckoutForm } from '../../../models/cart.model'; 

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  discount: number = 0;
  tax: number = 0;
  shipping: number = 10;
  total: number = 0;
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCartData();
  }

  initializeForm(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardExpiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cardCVV: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  loadCartData(): void {
    this.cartItems = this.cartService.getCartItems();
    
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      this.router.navigate(['/cart']);
      return;
    }

    this.calculateTotals();
  }

  calculateTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.discount = this.cartService.getTotalDiscount();
    this.tax = this.subtotal * 0.08;
    this.total = this.subtotal - this.discount + this.tax + this.shipping;
  }

  get f() {
    return this.checkoutForm.controls;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.controls[key].markAsTouched();
      });
      alert('Please fill all required fields correctly.');
      return;
    }

    this.submitting = true;

    // Simulate order processing
    setTimeout(() => {
      const orderData = {
        customerInfo: this.checkoutForm.value,
        items: this.cartItems,
        totals: {
          subtotal: this.subtotal,
          discount: this.discount,
          tax: this.tax,
          shipping: this.shipping,
          total: this.total
        },
        orderDate: new Date()
      };

      // Store order in localStorage for order confirmation
      localStorage.setItem('lastOrder', JSON.stringify(orderData));

      // Clear cart
      this.cartService.clearCart();

      // Navigate to order confirmation
      this.router.navigate(['/cart/order-confirmation']);
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}