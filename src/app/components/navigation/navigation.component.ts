




import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  template: `
    <nav class="navbar" *ngIf="isAuthenticated()">
      <div class="nav-brand">
        <h2>Medical App</h2>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" 
           [class.active]="isActiveRoute('/dashboard')">
          Dashboard
        </a>
        <a routerLink="/patients/search" 
           [class.active]="isActiveRoute('/patients/search')"
           *ngIf="isDoctor() || isArchivist()">
          Search Patients
        </a>
        <a routerLink="/patients" 
           [class.active]="isActiveRoute('/patients')"
           *ngIf="isDoctor()">
          Manage Patients
        </a>
        <button (click)="logout()" class="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #2c3e50;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    .nav-brand h2 {
      margin: 0;
      color: white;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .nav-links a:hover,
    .nav-links a.active {
      background-color: #34495e;
    }
    .logout-btn {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .logout-btn:hover {
      background-color: #c0392b;
    }
  `],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class NavigationComponent {
  // NO ngOnInit, NO AuthService injection!

  constructor(private router: Router) {
    // Only Router injection - no AuthService
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('medicalapp_token');
    const user = localStorage.getItem('medicalapp_user');
    return !!(token && user);
  }

  logout(): void {
    localStorage.removeItem('medicalapp_token');
    localStorage.removeItem('medicalapp_user');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isDoctor(): boolean {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return user.role === 1;
    } catch {
      return false;
    }
  }

  isArchivist(): boolean {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return user.role === 2;
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return user.role === 3;
    } catch {
      return false;
    }
  }
}