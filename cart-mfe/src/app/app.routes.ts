import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./cart/cart-module').then(m => m.CartModule)
  }
];