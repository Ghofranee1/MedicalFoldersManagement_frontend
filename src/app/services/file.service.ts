import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FichierMedical } from '../models/fichier-medical.model';

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
  //private readonly apiUrl = `${environment.apiUrl}/api/FichierMedical` || `${environment.apiUrl}/api/files`;
  //private readonly apiUrl = `${environment.apiUrl}/api/FichierMedical`;
  private readonly apiUrl = `${environment.apiUrl}/api/file`;

  constructor(private http: HttpClient) { }

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
    return this.http.post(`https://localhost:4000/api/file/upload`, formData, {
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
   * Download a file by its id
   */
  downloadFileById(fileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${fileId}`, {
      responseType: 'blob'
    });
  }

  /**
   * Get file info by ID (not used method)
   */
  getFileInfo(fileId: string): Observable<FileInfo> {
    return this.http.get<FileInfo>(`${this.apiUrl}/${fileId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get files by department (not used method)
   */
  getFilesByDepartment(departmentId: string): Observable<FileInfo[]> {
    return this.http.get<FileInfo[]>(`${this.apiUrl}/department/${departmentId}`)
      .pipe(
        catchError(this.handleError)
      );
  }




  /**
 * Delete a file by its ID
 */
  deleteFileById(fileId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fileId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get file by relative path (for display/preview) --- (not used method)
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



  getAllFiles(): Observable<FichierMedical[]> {
     return this.http.get<FichierMedical[]>(`${this.apiUrl}`);
  }
  

  /**
   * Preview a file by its id (for in-browser viewing)
   */
  previewFileById(fileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/preview/${fileId}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': '*/*'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Open file in new tab/window for preview with better error handling
   */
  openFilePreview(fileId: number, fileName?: string): void {
    console.log(`Attempting to preview file ID: ${fileId}, Name: ${fileName}`);

    this.previewFileById(fileId).subscribe({
      next: (blob: Blob) => {
        console.log(`File blob received, size: ${blob.size}, type: ${blob.type}`);

        if (blob.size === 0) {
          console.error('Received empty file blob');
          this.showErrorMessage('Le fichier est vide ou n\'a pas pu être chargé.');
          return;
        }

        const url = window.URL.createObjectURL(blob);
        console.log(`Created object URL: ${url}`);

        // Try to open in new tab/window
        const newWindow = window.open('', '_blank');

        if (newWindow) {
          // For better compatibility, navigate to the blob URL
          newWindow.location.href = url;

          // Set a meaningful title if fileName is provided
          if (fileName) {
            // Wait a bit for the page to load before setting title
            setTimeout(() => {
              try {
                newWindow.document.title = fileName;
              } catch (e) {
                console.warn('Could not set window title:', e);
              }
            }, 500);
          }

          // Clean up the URL after a delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            console.log('Object URL revoked');
          }, 10000); // Increased delay to ensure file loads
        } else {
          // Fallback if popup is blocked
          console.log('Popup blocked, using fallback method');
          this.createTempLinkAndClick(url, fileName || 'fichier');

          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        }
      },
      error: (err) => {
        console.error('Preview failed:', err);
        this.showErrorMessage('Impossible d\'ouvrir le fichier en aperçu.');

        // Fallback to download
        console.log('Attempting download fallback');
        this.downloadFileById(fileId).subscribe({
          next: (blob: Blob) => {
            console.log('Download fallback successful');
            this.triggerDownload(blob, fileName || 'fichier_medical');
          },
          error: (downloadErr) => {
            console.error('Download fallback also failed:', downloadErr);
            this.showErrorMessage('Impossible de télécharger ou de prévisualiser le fichier.');
          }
        });
      }
    });
  }

  /**
   * Create temporary link and trigger click
   */
  private createTempLinkAndClick(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';

    // Add to DOM temporarily
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Trigger file download
   */
  private triggerDownload(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  /**
   * Show error message to user (you can replace this with your notification service)
   */
  private showErrorMessage(message: string): void {
    // You can replace this with a toast notification service
    alert(message);
  }

  /**
   * Check if file type is previewable in browser
   */
  isPreviewableFileType(fileName: string): boolean {
    const extension = fileName.toLowerCase().split('.').pop();
    const previewableTypes = [
      'pdf', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
      'mp4', 'webm', 'ogg', 'mp3', 'wav', 'html', 'htm', 'css', 'js', 'json', 'xml'
    ];
    return previewableTypes.includes(extension || '');
  }

  /**
   * Get human-readable file type description
   */
  getFileTypeDescription(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop();

    const typeDescriptions: { [key: string]: string } = {
      'pdf': 'Document PDF',
      'jpg': 'Image JPEG',
      'jpeg': 'Image JPEG',
      'png': 'Image PNG',
      'gif': 'Image GIF',
      'bmp': 'Image Bitmap',
      'svg': 'Image vectorielle',
      'webp': 'Image WebP',
      'mp4': 'Vidéo MP4',
      'webm': 'Vidéo WebM',
      'ogg': 'Média OGG',
      'mp3': 'Audio MP3',
      'wav': 'Audio WAV',
      'txt': 'Fichier texte',
      'html': 'Page web',
      'htm': 'Page web',
      'doc': 'Document Word',
      'docx': 'Document Word',
      'xls': 'Feuille Excel',
      'xlsx': 'Feuille Excel',
      'ppt': 'Présentation PowerPoint',
      'pptx': 'Présentation PowerPoint'
    };

    return typeDescriptions[extension || ''] || 'Fichier';
  }
}