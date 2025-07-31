import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Redirects the base URL to /products
  { path: '', redirectTo: '/products', pathMatch: 'full' }, 
  
  // Wildcard route: Catches any unmatched paths and redirects to /login.
  // This route comes AFTER all specific routes from AuthModule and ProductsModule
  // are considered.
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Use forRoot for the root router
  exports: [RouterModule]
})
export class AppRoutingModule { }