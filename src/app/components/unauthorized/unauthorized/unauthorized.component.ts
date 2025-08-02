import { Component } from '@angular/core';
import { Router } from '@angular/router';
//import { AuthService } from '../../services/auth.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 text-center">
        <div>
          <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
          <p class="mt-2 text-sm text-gray-600">
            You don't have permission to access this resource.
          </p>
          <div class="mt-6">
            <button
              (click)="goBack()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}