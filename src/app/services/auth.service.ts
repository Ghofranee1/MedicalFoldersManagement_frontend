import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { catchError, tap } from 'rxjs/operators';

// Temporary minimal interfaces for testing
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: number;
  departementId?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  token: string;
  user: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = 'https://localhost:4000/api/auth'; // Update with your actual API URL
  private readonly TOKEN_KEY = 'medicalapp_token';
  private readonly USER_KEY = 'medicalapp_user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    console.log('AuthService constructor called');
    // Don't call initializeAuth immediately - test if this fixes the issue
    setTimeout(() => this.initializeAuth(), 0);
  }

  private initializeAuth(): void {
    console.log('Initializing auth...');
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userJson = localStorage.getItem(this.USER_KEY);

      if (token && userJson) {
        const user = JSON.parse(userJson);
        this.updateAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
        console.log('Auth initialized with existing data');
      } else {
        console.log('No existing auth data found');
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.logout();
    }
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    console.log('Attempting login for user:', loginRequest.username);

    this.updateAuthState({ isLoading: true });

    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/login`, loginRequest)
      .pipe(
        tap((response: LoginResponse) => {
          console.log('Login successful:', response);
          this.handleAuthSuccess(response.token, response.user);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Login error:', error);
          this.updateAuthState({ isLoading: false });
          return this.handleError(error);
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    console.log('Attempting registration for user:', registerRequest.username);

    this.updateAuthState({ isLoading: true });

    return this.http.post<RegisterResponse>(`${this.API_BASE_URL}/register`, registerRequest)
      .pipe(
        tap((response: RegisterResponse) => {
          console.log('Registration successful:', response);
          this.handleAuthSuccess(response.token, response.user);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Registration error:', error);
          this.updateAuthState({ isLoading: false });
          return this.handleError(error);
        })
      );
  }

  private handleAuthSuccess(token: string, user: User): void {
    // Store token and user data in localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    // Update auth state
    this.updateAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    });

    console.log('Auth success handled, user authenticated');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid credentials. Please check your username and password.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request. Please check your input.';
      } else if (error.status === 409) {
        errorMessage = 'User already exists. Please choose a different username or email.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else {
        errorMessage = error.error?.message || `Server Error: ${error.status}`;
      }
    }

    console.error('Error details:', error);
    return throwError(() => ({ error: { message: errorMessage } }));
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  isAuthenticated(): boolean {
    const state = this.authStateSubject.value;
    return state.isAuthenticated && !!state.token && !!state.user;
  }

  isDoctor(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 1;
  }

  isArchivist(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 2;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 3;
  }

  canAccessDepartment(departmentId: number): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    if (user.role === 1 || user.role === 3) return true;
    if (user.role === 2) {
      return user.departementId === departmentId;
    }

    return false;
  }

  logout(): void {
    console.log('Logging out...');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.updateAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });

    this.router.navigate(['/login']);
  }

  private updateAuthState(newState: Partial<AuthState>): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({ ...currentState, ...newState });
  }

  // Method to refresh token if needed
  refreshToken(): Observable<LoginResponse> {
    const currentToken = this.getToken();
    if (!currentToken) {
      return throwError(() => ({ error: { message: 'No token available' } }));
    }

    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/refresh`, { token: currentToken })
      .pipe(
        tap((response: LoginResponse) => {
          this.handleAuthSuccess(response.token, response.user);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Token refresh failed:', error);
          this.logout();
          return this.handleError(error);
        })
      );
  }

  // Method to verify token validity
  verifyToken(): Observable<{ valid: boolean; user?: User }> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => ({ error: { message: 'No token available' } }));
    }

    return this.http.get<{ valid: boolean; user?: User }>(`${this.API_BASE_URL}/verify`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Token verification failed:', error);
          this.logout();
          return this.handleError(error);
        })
      );
  }

  // Dummy methods to test HTTP functionality
  testHttpClient(): Observable<any> {
    console.log('Testing HttpClient...');
    return this.http.get('https://jsonplaceholder.typicode.com/posts/1');
  }
}