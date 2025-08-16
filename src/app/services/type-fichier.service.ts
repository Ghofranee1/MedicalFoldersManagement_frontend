import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { TypeFichier } from '../models/type-fichier.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TypeFichierService {

  private readonly endpoint = 'api/typefichier';

  constructor(private apiService: ApiService) { }

  getAllTypeFichier(): Observable<TypeFichier[]> {
      return this.apiService.get<TypeFichier[]>(this.endpoint);
    }
  
    getTypeFichierById(id: number): Observable<ApiResponse<TypeFichier>> {
      return this.apiService.get<ApiResponse<TypeFichier>>(`${this.endpoint}/${id}`);
    }
  
  createTypeFichier(typeFichier: TypeFichier): Observable<ApiResponse<TypeFichier>> {
    return this.apiService.post<ApiResponse<TypeFichier>>(this.endpoint, typeFichier);
    }
  
  updateTypeFichier(id: number, typeFichier: TypeFichier): Observable<ApiResponse<TypeFichier>> {
    return this.apiService.put<ApiResponse<TypeFichier>>(`${this.endpoint}/${id}`, typeFichier);
    }
  
  deleteTypeFichier(id: number): Observable<ApiResponse<any>> {
      return this.apiService.delete<ApiResponse<any>>(`${this.endpoint}/${id}`);
  }
  

  
}
