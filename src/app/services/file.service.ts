import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface FileUploadData {
  file: File;
  fileName: string;
  description: string;
  departmentId: string;
  category: string;
  tags: string[];
}

export interface FileUploadResponse {
  success: boolean;
  filePath: string;
  message: string;
  fileId?: string;
}

export interface FileInfo {
  id: string;
  fileName: string;
  filePath: string;
  description: string;
  category: string;
  tags: string[];
  uploadDate: Date;
  fileSize: number;
  contentType: string;
  departmentId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly apiUrl = `${environment.apiUrl}/api/file`;

  constructor(private http: HttpClient) {}

  /**
   * Upload a single file with metadata
   */
  /*
  uploadFile(fileData: FileUploadData): Observable<FileUploadResponse> {
    const formData = new FormData();
    
    // Append file
    formData.append('file', fileData.file, fileData.fileName);
    
    // Append metadata
    formData.append('description', fileData.description);
    formData.append('departmentId', fileData.departmentId);
    formData.append('category', fileData.category);
    
    // Append tags as individual entries
    fileData.tags.forEach(tag => {
      formData.append('tags', tag);
    });

    return this.http.post<FileUploadResponse>(`${this.apiUrl}/upload`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }
*/
  
  uploadFile(formData: FormData): Observable<any> {
    // Don't set Content-Type header - let the browser set it automatically for FormData
    // This ensures proper multipart/form-data boundary is set
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  /**
   * Upload a file with progress tracking
   */
  uploadFileWithProgress(fileData: FileUploadData): Observable<any> {
    const formData = new FormData();
    
    formData.append('file', fileData.file, fileData.fileName);
    formData.append('description', fileData.description);
    formData.append('departmentId', fileData.departmentId);
    formData.append('category', fileData.category);
    
    fileData.tags.forEach(tag => {
      formData.append('tags', tag);
    });

    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / (event.total || 1));
            return { status: 'progress', message: progress };

          case HttpEventType.Response:
            return { status: 'complete', body: event.body };

          default:
            return { status: 'uploading', message: 'Uploading...' };
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Upload multiple files
   */
  /*
  uploadMultipleFiles(filesData: FileUploadData[]): Observable<FileUploadResponse[]> {
    const uploadObservables = filesData.map(fileData => this.uploadFile(fileData));
    
    // Use combineLatest or forkJoin to handle multiple uploads
    return new Observable(observer => {
      Promise.all(uploadObservables.map(obs => obs.toPromise()))
        .then(results => {
          observer.next(results as FileUploadResponse[]);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
*/
  /**
   * Download a file by its path
   */
  downloadFile(filePath: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download`, {
      params: { filePath },
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get file info by ID
   */
  getFileInfo(fileId: string): Observable<FileInfo> {
    return this.http.get<FileInfo>(`${this.apiUrl}/${fileId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get files by department
   */
  getFilesByDepartment(departmentId: string): Observable<FileInfo[]> {
    return this.http.get<FileInfo[]>(`${this.apiUrl}/department/${departmentId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete a file
   */
  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fileId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get file by relative path (for display/preview)
   */
  getFileByPath(relativePath: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/view`, {
      params: { path: relativePath },
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, maxSize: number = 50 * 1024 * 1024, allowedTypes: string[] = []): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${this.formatFileSize(maxSize)}`
      };
    }

    // Check file type if allowedTypes is provided
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type "${file.type}" is not allowed`
      };
    }

    return { valid: true };
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file icon class based on file type
   */
  getFileIconClass(fileType: string): string {
    if (fileType.startsWith('image/')) return 'fas fa-image';
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('word')) return 'fas fa-file-word';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'fas fa-file-excel';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'fas fa-file-powerpoint';
    if (fileType.includes('text')) return 'fas fa-file-alt';
    return 'fas fa-file';
  }

  /**
   * Create a safe filename
   */
  createSafeFileName(originalName: string): string {
    // Remove special characters and spaces, keep extension
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    return `${safeName}${extension}`;
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
      } else if (error.status === 413) {
        errorMessage = 'File size too large';
      } else if (error.status === 415) {
        errorMessage = 'Unsupported file type';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server error: ${error.status} ${error.statusText}`;
      }
    }
    
    console.error('FileService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}