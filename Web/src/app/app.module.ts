import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // Needed for forms

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import your feature modules here
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

// Import your interceptors
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor'; // Assuming you have this

// Import your components for direct declaration if not part of a feature module's exports
import { HomeComponent } from './home/home.component'; // Example, if you have a home component

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent // Declare if it's a root-level component
    // Login & Register components are declared in AuthModule
    // Product components are declared in ProductsModule
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthModule,
    ProductsModule,
    AppRoutingModule, 
  ],
  providers: [
    // Provide your interceptors here
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }