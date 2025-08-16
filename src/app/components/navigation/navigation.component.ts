/*
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepartementService } from '../../services/departement.service';

@Component({
  selector: 'app-navigation',
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h2>Gestion des Dossiers Médicaux</h2>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" 
           [class.active]="isActiveRoute('/dashboard')">
          Tableau de Bord
        </a>
        <a routerLink="/patients/search" 
           [class.active]="isActiveRoute('/patients/search')"
           *ngIf="isDoctor() || isArchivist() || isAdmin()">
          Recherche de patients
        </a>
        
        <a routerLink="/register"
           [class.active]="isActiveRoute('/register')"
           *ngIf="isAdmin()">
          Créer un compte d'utilisateur
        </a>
        
        <button (click)="login()" class="login-btn"  *ngIf="!isAuthenticated()">
            Connexion
        </button>
        
        <button (click)="logout()" class="logout-btn" *ngIf="isAuthenticated()">
            Déconnexion
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

    .login-btn:hover {
      background-color: #2bc04eff;
    }
    .login-btn {
      background-color: #62c02bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
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
    console.log('Logging out...');
    this.router.navigate(['/login']);
    localStorage.removeItem('medicalapp_token');
    localStorage.removeItem('medicalapp_user');
    sessionStorage.clear();
    window.location.reload(); 
  }

  login(): void {
    
    this.router.navigate(['/login']);   
    console.log('Login button clicked');

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
*/


import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h2>Gestion des Dossiers Médicaux</h2>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard"
        *ngIf="isAuthenticated()"
           [class.active]="isActiveRoute('/dashboard')">
          Tableau de Bord
        </a>
        <a routerLink="/patients/search" 
           [class.active]="isActiveRoute('/patients/search')"
           *ngIf="isDoctor() || isArchivist() || isAdmin()">
          Recherche de patients
        </a>
        
        <!--
      <a routerLink="/register"
          href="javascript:void(0)"
          [class.active]="isActiveRoute('/register')"
          *ngIf="isAdmin()">
          Créer un compte d'utilisateur
        </a>
       -->

        <a routerLink="/admin-user-management"
          href="javascript:void(0)"
          [class.active]="isActiveRoute('/admin-user-management')"
          *ngIf="isAdmin()">
          Gérer les utilisateurs
        </a>

        <a (click)="navigateAndReload('/manage-types-version-2')"
          href="javascript:void(0)"
          [class.active]="isActiveRoute('/manage-types-version-2')"
          *ngIf="isAdmin()">
          Gérer les types de fichiers
        </a>

        <button (click)="login()" class="login-btn" *ngIf="!isAuthenticated()">
            Connexion
        </button>
        
        <!-- User Menu -->
        <div class="user-menu" *ngIf="isAuthenticated()">
          <div class="user-icon" (click)="toggleUserMenu($event)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          
          <div class="user-dropdown" [ngClass]="{'show': showUserMenu}">
            <div class="user-info">
              <div class="user-name">{{ getUserName() }}</div>
              <div class="user-role">{{ getUserRole() }}</div>
              <div class="user-role" *ngIf="isArchivist() || isDoctor()">{{ getUserDepartmentName() }}</div>
              <div class="user-role" *ngIf="isArchivist() || isDoctor() ">{{ getUserDepartmentId() }}</div>

            </div>
            <hr class="dropdown-divider">
            <button (click)="logout()" class="dropdown-logout-btn">
              Déconnexion
            </button>
          </div>
        </div>
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
    .login-btn {
      background-color: #62c02bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .login-btn:hover {
      background-color: #2bc04eff;
    }

    /* User Menu Styles */
    .user-menu {
      position: relative;
    }
    
    .user-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #34495e;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s;
      border: 2px solid transparent;
    }
    
    .user-icon:hover {
      background-color: #4a5f7a;
      border-color: #5a6f8a;
    }
    
    .user-icon svg {
      color: white;
    }
    
    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: white;
      color: #333;
      min-width: 200px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      margin-top: 8px;
      z-index: 1001;
    }
    
    .user-dropdown.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .user-info {
      padding: 16px;
    }
    
    .user-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
      color: #2c3e50;
    }
    
    .user-role {
      font-size: 14px;
      color: #7f8c8d;
    }
    
    .dropdown-divider {
      border: none;
      border-top: 1px solid #ecf0f1;
      margin: 0;
    }
    
    .dropdown-logout-btn {
      width: 100%;
      padding: 12px 16px;
      border: none;
      background-color: transparent;
      color: #e74c3c;
      font-size: 14px;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.2s;
      border-radius: 0 0 8px 8px;
    }
    
    .dropdown-logout-btn:hover {
      background-color: #f8f9fa;
    }

    /* Close dropdown when clicking outside */
    @media (max-width: 768px) {
      .user-dropdown {
        right: -10px;
        min-width: 180px;
      }
    }
  `],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class NavigationComponent {
  showUserMenu = false;
archivistDepartmentId: any;

  constructor(private router: Router) { }

  ngOnInit() {
    // Listen for clicks outside to close dropdown
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const userMenu = target.closest('.user-menu');
      if (!userMenu && this.showUserMenu) {
        this.showUserMenu = false;
      }
    });
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('medicalapp_token');
    const user = localStorage.getItem('medicalapp_user');
    return !!(token && user);
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showUserMenu = !this.showUserMenu;
    //console.log('Toggle user menu:', this.showUserMenu); // Debug log
  }

  getUserName(): string {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return 'Utilisateur';
      const user = JSON.parse(userStr);
      return user.name || user.username || 'Utilisateur';
    } catch {
      return 'Utilisateur';
    }
  }

  getUserRole(): string {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return '';
      const user = JSON.parse(userStr);
      switch (user.role) {
        case 1: return 'Médecin';
        case 2: return 'Archiviste';
        case 3: return 'Administrateur';
        default: return 'Utilisateur';
      }
    } catch {
      return 'Utilisateur';
    }
  }


  getUserDepartmentId(): number {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return 0;
      const user = JSON.parse(userStr);
      //console.log('User Department ID:', user.departementId); // Debug log
      return user.departementId;
    } catch {
      return 0;
    }
  }


  getUserDepartmentName(): string {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return 'department inconnu';
      const user = JSON.parse(userStr);
      //console.log('User Department ID:', user.departementName); // Debug log
      return user.departementName;
    } catch {
      return 'department inconnu';
    }
  }


  logout(): void {
    console.log('Logging out...');
    this.showUserMenu = false; // Close the dropdown
    localStorage.removeItem('medicalapp_token');
    localStorage.removeItem('medicalapp_user');
    sessionStorage.clear();
    this.router.navigate(['/login']);
    window.location.reload();
  }

  login(): void {
    this.router.navigate(['/login']);
    console.log('Login button clicked');
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

  navigateAndReload(route: string): void {
    this.router.navigate([route]);
  }
}