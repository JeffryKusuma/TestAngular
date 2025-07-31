import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Intercepts HTTP responses and handles errors globally.
   *
   * @param request The outgoing HttpRequest.
   * @param next The HttpHandler that dispatches the request to the next interceptor or backend.
   * @returns An Observable of the HTTP event.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log the full error to the console for debugging
        console.error('HTTP Error Intercepted:', error);

        // Check for specific status codes
        if (error.status === 401) {
          // 401 Unauthorized Error: Automatically log out the user.
          // This happens when the JWT token is missing, expired, or invalid.
          this.authService.logout();
          // Redirect the user to the login page with a return URL
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
          return throwError(() => new Error('Unauthorized access. Please log in again.'));
        }

        if (error.status === 403) {
          // 403 Forbidden Error: User is authenticated but lacks the necessary permissions.
          // You might want to redirect to a different page or show a specific message.
          // For now, we'll just throw an error.
          return throwError(() => new Error('Forbidden. You do not have permission to access this resource.'));
        }

        // Handle generic errors (e.g., 500, 404)
        // Extract the error message from the backend response if available,
        // otherwise provide a generic message.
        const errorMessage = error.error?.message || error.statusText || 'An unexpected error occurred.';

        // Create and re-throw the error with a more useful message
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}