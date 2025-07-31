import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { CreateDossierRequest } from '../models/create-dossier-request.model';
import { DossierMedical } from '../models/dossier-medical.model';
import { DossierStatistics } from '../models/statistics.model';
import { UpdateDossierRequest } from '../models/update-dossier-request.model';

@Injectable({
  providedIn: 'root'
})
export class DossierMedicalService {
  private readonly endpoint = 'api/DossierMedical';

  constructor(private apiService: ApiService) {}

  getAllDossiers(): Observable<ApiResponse<DossierMedical[]>> {
    return this.apiService.get<ApiResponse<DossierMedical[]>>(this.endpoint);
  }

  getDossierById(id: number): Observable<ApiResponse<DossierMedical>> {
    return this.apiService.get<ApiResponse<DossierMedical>>(`${this.endpoint}/${id}`);
  }

  getDossiersByPatient(ipp: string): Observable<ApiResponse<DossierMedical[]>> {
    return this.apiService.get<ApiResponse<DossierMedical[]>>(`${this.endpoint}/patient/${ipp}`);
  }

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

  checkDossierExists(id: number): Observable<any> {
    return this.apiService.head(`${this.endpoint}/${id}`);
  }

  getDossiersStatistics(): Observable<ApiResponse<DossierStatistics>> {
    return this.apiService.get<ApiResponse<DossierStatistics>>(`${this.endpoint}/statistics`);
    }
    
  downloadFileById(fileId: number): Observable<Blob> {
  return this.apiService.getBlob(`https://localhost:4000/api/FichierMedical/${fileId}/download`);
}


}