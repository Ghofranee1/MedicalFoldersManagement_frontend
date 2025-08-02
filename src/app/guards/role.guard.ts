import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('RoleGuard checking access for:', state.url);
    
    try {
      const user = this.authService.getCurrentUser();
      
      if (!user) {
        console.log('No user found in RoleGuard, redirecting to login');
        this.router.navigate(['/login']);
        return false;
      }

      const allowedRoles = route.data['allowedRoles'] as UserRole[];
      console.log('Role check:', { 
        userRole: user.role, 
        allowedRoles,
        hasAccess: allowedRoles ? allowedRoles.includes(user.role) : true
      });
      
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log('User role not allowed, redirecting to unauthorized');
        this.router.navigate(['/unauthorized']);
        return false;
      }

      console.log('Role check passed');
      return true;
      
    } catch (error) {
      console.error('Error in RoleGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}