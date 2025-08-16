import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take, catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('AuthGuard canActivate called for:', state.url);
    return this.checkAuth(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('AuthGuard canActivateChild called for:', state.url);
    return this.checkAuth(route, state);
  }

  private checkAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('AuthGuard: Starting auth check for:', state.url);

    // Wait for authentication service to be ready (session restored)
    return this.authService.isAuthReady().pipe(
      take(1),
      switchMap((isReady) => {
        console.log('AuthService ready status:', isReady);

        try {
          const isAuthenticated = this.authService.isAuthenticated();
          const currentUser = this.authService.getCurrentUser();
          const token = this.authService.getToken();

          console.log('Auth check results after ready:', {
            isAuthenticated,
            hasUser: !!currentUser,
            hasToken: !!token,
            targetUrl: state.url
          });

          if (!isAuthenticated || !currentUser || !token) {
            console.log('User not authenticated after ready check, redirecting to login');
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return of(false);
          }

          // Check department access for archivists
          const departmentId = route.params['departmentId'];
          if (departmentId && !this.authService.canAccessDepartment(+departmentId)) {
            console.log('User cannot access department, redirecting to unauthorized');
            this.router.navigate(['/unauthorized']);
            return of(false);
          }

          console.log('Auth check passed, allowing access to:', state.url);
          return of(true);

        } catch (error) {
          console.error('Error in AuthGuard after ready:', error);
          this.router.navigate(['/login']);
          return of(false);
        }
      }),
      catchError((error) => {
        console.error('Error waiting for auth service to be ready:', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}