import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Departement } from '../models/departement.model';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private readonly endpoint = 'api/Departement';

  constructor(private apiService: ApiService) {}

  getAllDepartements(): Observable<ApiResponse<Departement[]>> {
    return this.apiService.get<ApiResponse<Departement[]>>(this.endpoint);
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