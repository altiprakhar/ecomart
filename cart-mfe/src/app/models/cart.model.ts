export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedTotal: number;
    thumbnail: string;
  }
  
  export interface Cart {
    id: number;
    products: CartItem[];
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
  }
  
  export interface CheckoutForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCVV?: string;
  }
  
  export interface OrderSummary {
    items: CartItem[];
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    orderDate: Date;
    customerInfo: CheckoutForm;
  }