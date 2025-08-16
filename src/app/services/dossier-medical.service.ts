import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { CreateDossierRequest } from '../models/create-dossier-request.model';
import { DossierMedical } from '../models/dossier-medical.model';
import { DossierStatistics } from '../models/statistics.model';
import { UpdateDossierRequest } from '../models/update-dossier-request.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DossierMedicalService {
  getFileById(fileId: number) {
    throw new Error('Method not implemented.');
  }
  private readonly endpoint = 'api/DossierMedical';
  private readonly apiUrl = `${environment.apiUrl}/api/DossierMedical`;
  constructor(private apiService: ApiService, private http: HttpClient) {}
/*
  getAllDossiers(): Observable<ApiResponse<DossierMedical[]>> {
    return this.apiService.get<ApiResponse<DossierMedical[]>>(this.endpoint);
  }
*/
  getDossierById(id: number): Observable<ApiResponse<DossierMedical>> {
    return this.apiService.get<ApiResponse<DossierMedical>>(`${this.endpoint}/${id}`);
  }

  getDossiersByPatient(ipp: string): Observable<ApiResponse<DossierMedical[]>> {
    return this.apiService.get<ApiResponse<DossierMedical[]>>(`${this.endpoint}/patient/${ipp}`);
  }
/*
  getDossierByPatientAndDepartement(ipp: string, departementId: number): Observable<ApiResponse<DossierMedical>> {
    return this.apiService.get<ApiResponse<DossierMedical>>(`${this.endpoint}/patient/${ipp}/departement/${departementId}`);
  }

  createDossier(request: CreateDossierRequest): Observable<ApiResponse<DossierMedical>> {
    return this.apiService.post<ApiResponse<DossierMedical>>(this.endpoint, request);
  }

  updateDossier(id: number, request: UpdateDossierRequest): Observable<ApiResponse<DossierMedical>> {
    return this.apiService.put<ApiResponse<DossierMedical>>(`${this.endpoint}/${id}`, request);
  }

  deleteDossier(id: number): Observable<ApiResponse<any>> {
    return this.apiService.delete<ApiResponse<any>>(`${this.endpoint}/${id}`);
  }
*/
  checkDossierExists(id: number): Observable<any> {
    return this.apiService.head(`${this.endpoint}/${id}`);
  }

  getDossiersStatistics(): Observable<ApiResponse<DossierStatistics>> {
    return this.apiService.get<ApiResponse<DossierStatistics>>(`${this.endpoint}/statistics`);
    }


  


  










  //added methods
  // Get all dossiers
  getAllDossiers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
/*
  // Get dossier by ID
  getDossierById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Get dossiers by patient IPP
  
  getDossiersByPatient(ipp: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patient/${ipp}`);
  }
  */

/*  getDossiersByPatient(ipp: string): Observable<ApiResponse<DossierMedical[]>> {
    return this.apiService.get<ApiResponse<DossierMedical[]>>(`${this.endpoint}/patient/${ipp}`);
  }
*/
  // Get dossier by patient and department (NEW METHOD)
  getDossierByPatientAndDepartement(ipp: string, departementId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patient/${ipp}/departement/${departementId}`);
  }

  // Create new dossier (NEW METHOD)
  createDossier(request: { ipp: string; departementId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, request);
  }

  // Update dossier
  updateDossier(id: number, request: { departementId: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, request);
  }

  // Delete dossier
  deleteDossier(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Check if dossier exists
  dossierExists(id: number): Observable<any> {
    return this.http.head<any>(`${this.apiUrl}/${id}`);
  }

  // Get statistics
  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }





  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server';
      } else if (error.status === 404) {
        errorMessage = 'File not found';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to delete this file';
      } else if (error.status === 500) {
        errorMessage = 'Server error occurred while deleting the file';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server error: ${error.status} ${error.statusText}`;
      }
    }

    console.error('DossierMedicalService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}