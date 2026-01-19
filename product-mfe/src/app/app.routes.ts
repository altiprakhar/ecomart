import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./product/product-module').then(m => m.ProductModule)
  }
];