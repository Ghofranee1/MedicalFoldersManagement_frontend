import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log('AuthGuard canActivate called for:', state.url);
    return this.checkAuth(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log('AuthGuard canActivateChild called for:', state.url);
    return this.checkAuth(route, state);
  }

  private checkAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    try {
      // First try synchronous check
      const isAuthenticated = this.authService.isAuthenticated();
      const currentUser = this.authService.getCurrentUser();
      const token = this.authService.getToken();
      
      console.log('Auth check results:', {
        isAuthenticated,
        hasUser: !!currentUser,
        hasToken: !!token,
        targetUrl: state.url
      });

      if (!isAuthenticated || !currentUser || !token) {
        console.log('User not authenticated, redirecting to login');
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      // Check department access for archivists
      const departmentId = route.params['departmentId'];
      if (departmentId && !this.authService.canAccessDepartment(+departmentId)) {
        console.log('User cannot access department, redirecting to unauthorized');
        this.router.navigate(['/unauthorized']);
        return false;
      }

      console.log('Auth check passed, allowing access');
      return true;
      
    } catch (error) {
      console.error('Error in AuthGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}