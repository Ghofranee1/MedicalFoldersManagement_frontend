
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Departement } from '../models/departement.model';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private readonly endpoint = 'api/departement';

  constructor(private apiService: ApiService) {}

  getAllDepartements(): Observable<Departement[]> {
    return this.apiService.get<Departement[]>(this.endpoint);
  }

  getDepartementById(id: number): Observable<ApiResponse<Departement>> {
    return this.apiService.get<ApiResponse<Departement>>(`${this.endpoint}/${id}`);
  }

  createDepartement(departement: Departement): Observable<ApiResponse<Departement>> {
    return this.apiService.post<ApiResponse<Departement>>(this.endpoint, departement);
  }

  updateDepartement(id: number, departement: Departement): Observable<ApiResponse<Departement>> {
    return this.apiService.put<ApiResponse<Departement>>(`${this.endpoint}/${id}`, departement);
  }

  deleteDepartement(id: number): Observable<ApiResponse<any>> {
    return this.apiService.delete<ApiResponse<any>>(`${this.endpoint}/${id}`);
  }
}
  


/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { DossierMedical } from '../models/dossier-medical.model';

// Backend model
export interface Departement {
  id: number;
  libelleFr: string;
  libelleAr?: string;
  abreviationFr?: string;
  abreviationAr?: string;
  reference?: string;
  status: number;
  dossiers?: DossierMedical[];
}

// Frontend model (matching your components)
export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  head?: string;
  location?: string;
  phoneNumber?: string;
  email?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  fileCount?: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  total?: number;
  patientIpp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private readonly apiUrl = `${environment.apiUrl}/api/departement`;

  constructor(private http: HttpClient, private apiService: ApiService) {}

  /* commented method
  getAllDepartements(): Observable<Department[]> {
    return this.http.get<ApiResponse<Departement[]>>(`${this.apiUrl}`)
      .pipe(
        map(response => response.data.map(dept => this.mapToFrontendModel(dept))),
        catchError(error => {
          console.error('Error fetching departments:', error);
          throw error;
        })
      );
  }
  
  

  getAllDepartements(): Observable<Department[]> {
  return this.http.get<Departement[]>(`${this.apiUrl}`)
    .pipe(
      map(departements => departements.map(dept => this.mapToFrontendModel(dept))),
      catchError(error => {
        console.error('Error fetching departments:', error);
        throw error;
      })
    );
}

  
  
  getAllDepartements2(): Observable<Department[]> {
    return this.apiService.get<Departement[]>(`${this.apiUrl}`);
  }


  /* //commented method
  getDepartementById(id: number): Observable<Department> {
    return this.http.get<ApiResponse<Departement>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => this.mapToFrontendModel(response.data)),
        catchError(error => {
          console.error('Error fetching department:', error);
          throw error;
        })
      );
  }
  
  
  
  getDepartementById(id: number): Observable<Department> {
  return this.http.get<Departement>(`${this.apiUrl}/${id}`)
    .pipe(
      map(dept => this.mapToFrontendModel(dept)),
      catchError(error => {
        console.error('Error fetching department:', error);
        throw error;
      })
    );
}


  createDepartement(department: Partial<Department>): Observable<Department> {
    const backendModel = this.mapToBackendModel(department);
    return this.http.post<ApiResponse<Departement>>(`${this.apiUrl}`, backendModel)
      .pipe(
        map(response => this.mapToFrontendModel(response.data)),
        catchError(error => {
          console.error('Error creating department:', error);
          throw error;
        })
      );
  }

  updateDepartement(id: number, department: Partial<Department>): Observable<Department> {
    const backendModel = this.mapToBackendModel(department);
    return this.http.put<ApiResponse<Departement>>(`${this.apiUrl}/${id}`, backendModel)
      .pipe(
        map(response => this.mapToFrontendModel(response.data)),
        catchError(error => {
          console.error('Error updating department:', error);
          throw error;
        })
      );
  }

  deleteDepartement(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error deleting department:', error);
          throw error;
        })
      );
  }

  // Helper method to map backend model to frontend model
  private mapToFrontendModel(backendDept: Departement): Department {
    return {
      id: backendDept.id,
      name: backendDept.libelleFr,
      code: backendDept.abreviationFr || backendDept.reference || '',
      description: backendDept.libelleAr,
      head: '', // You may need to add this field to your backend model
      location: '', // You may need to add this field to your backend model
      phoneNumber: '', // You may need to add this field to your backend model
      email: '', // You may need to add this field to your backend model
      status: backendDept.status === 1 ? 'active' : 'inactive',
      createdAt: new Date(), // You may need to add this field to your backend model
      updatedAt: new Date(), // You may need to add this field to your backend model
      fileCount: 0 // You may need to calculate this or add to your backend model
    };
  }

  // Helper method to map frontend model to backend model
  private mapToBackendModel(frontendDept: Partial<Department>): Partial<Departement> {
    return {
      libelleFr: frontendDept.name,
      libelleAr: frontendDept.description,
      abreviationFr: frontendDept.code,
      reference: frontendDept.code,
      status: frontendDept.status === 'active' ? 1 : 0
    };
  }
}
*/