export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
  }
  
  export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  }
  
  export interface Category {
    slug: string;
    name: string;
    url: string;
  }
  
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