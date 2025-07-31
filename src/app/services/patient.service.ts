import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly endpoint = 'api/Patient';

  constructor(private apiService: ApiService) {}

  /*
    getAllPatients(): Observable<ApiResponse<Patient[]>> {
    return this.apiService.get<ApiResponse<Patient[]>>(this.endpoint);
  }
  */
 getAllPatients(): Observable<Patient[]> {
    return this.apiService.get<Patient[]>(this.endpoint);
 }


  getPatientByIpp(ipp: string): Observable<ApiResponse<Patient>> {
    return this.apiService.get<ApiResponse<Patient>>(`${this.endpoint}/${ipp}`);
  }

  createPatient(patient: Patient): Observable<ApiResponse<Patient>> {
    return this.apiService.post<ApiResponse<Patient>>(this.endpoint, patient);
  }

  updatePatient(ipp: string, patient: Patient): Observable<ApiResponse<Patient>> {
    return this.apiService.put<ApiResponse<Patient>>(`${this.endpoint}/${ipp}`, patient);
  }

  deletePatient(ipp: string): Observable<ApiResponse<any>> {
    return this.apiService.delete<ApiResponse<any>>(`${this.endpoint}/${ipp}`);
  }

    /*
  searchPatients(searchTerm: string): Observable<ApiResponse<Patient[]>> {
    return this.apiService.get<ApiResponse<Patient[]>>(`${this.endpoint}/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  }
  */
 searchPatients(searchTerm: string): Observable<Patient[]> {
   return this.apiService.get<Patient[]>(`${this.endpoint}/search?searchTerm=${encodeURIComponent(searchTerm)}`);
 }


  checkPatientExists(ipp: string): Observable<any> {
    return this.apiService.head(`${this.endpoint}/${ipp}`);
  }
}