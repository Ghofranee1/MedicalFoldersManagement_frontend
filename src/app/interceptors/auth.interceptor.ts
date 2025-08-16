import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle authentication errors
        if (error.status === 401) {
          this.authService.logout();
          return throwError(() => error);
        }

        // Handle serialization circular reference errors
        // These appear as status 200 with HttpErrorResponse due to corrupted response
        if (error.status === 200 && error.name === 'HttpErrorResponse') {
          console.warn(`Server serialization error detected for ${req.url} - returning empty response`);

          // Return appropriate empty response based on the endpoint
          if (req.url.includes('/Patient')) {
            return of(new HttpResponse({
              body: [],
              status: 200,
              statusText: 'OK',
              url: req.url
            }));
          }

          // For other endpoints that might have similar issues
          if (req.url.includes('/api/')) {
            return of(new HttpResponse({
              body: [],
              status: 200,
              statusText: 'OK',
              url: req.url
            }));
          }
        }

        /*
        // Handle ERR_HTTP2_PROTOCOL_ERROR which might show up as status 0
        if (error.status === 0 && error.error instanceof ProgressEvent) {
          console.warn(`HTTP2 protocol error detected for ${req.url} - likely due to server serialization issue`);

          if (req.url.includes('/Patient')) {
            return of(new HttpResponse({
              body: [],
              status: 200,
              statusText: 'OK',
              url: req.url
            }));
          }
        }
*/
        // More specific URL handling
        if (error.status === 200 && error.name === 'HttpErrorResponse') {
          console.warn(`Server serialization error detected for ${req.url}`);

          // Handle specific endpoints that are known to have circular reference issues
          const problematicEndpoints = ['/Patient', '/Dossier', '/Departement'];
          const isProblematicEndpoint = problematicEndpoints.some(endpoint =>
            req.url.includes(endpoint)
          );

          if (isProblematicEndpoint) {
            return of(new HttpResponse({
              body: [],
              status: 200,
              statusText: 'OK',
              url: req.url
            }));
          }
        }
        return throwError(() => error);
      })
    );
  }
}