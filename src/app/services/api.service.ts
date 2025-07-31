import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
    }
    
    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  head(endpoint: string): Observable<any> {
    return this.http.head(`${this.baseUrl}/${endpoint}`)
      .pipe(catchError(this.handleError));
    }
    
    getFile(url: string): Observable<Blob> {
  return this.http.get(url, { responseType: 'blob' });
}
getBlob(url: string): Observable<Blob> {
  return this.http.get(url, { responseType: 'blob' });
}

}