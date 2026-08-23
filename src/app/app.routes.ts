import { Routes } from '@angular/router';
export const routes: Routes=[{path:'',pathMatch:'full',redirectTo:'produtos'},{path:'produtos',loadComponent:()=>import('./features/products/pages/products-list/products-list').then(m=>m.ProductsPage)},{path:'movimentacoes',loadComponent:()=>import('./features/products/pages/movements-list/movements-list').then(m=>m.MovementsPage)}];
