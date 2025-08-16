/*
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DossierMedicalService } from '../../services/dossier-medical.service';
import { CommonModule } from '@angular/common';
import { DossierMedical } from '../../models/dossier-medical.model';
//import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dossier-detail',
  templateUrl: './dossier-detail.component.html',
  styleUrls: ['./dossier-detail.component.css'],
  standalone: true,
  imports: [CommonModule]

})
export class DossierDetailComponent implements OnInit {
  @Input() dossier!: DossierMedical;
  @Output() close = new EventEmitter<void>();

  fullDossier: DossierMedical | null = null;
  loading = false;
  error: string | null = null;

  constructor(private dossierService: DossierMedicalService) {}

  ngOnInit() {
    this.loadFullDossier();
  }

  private loadFullDossier() {
    this.loading = true;
    this.dossierService.getDossierById(this.dossier.id).subscribe({
      next: (response) => {
        this.fullDossier = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  /*
  le(filePath: string) {
    // Implement file download logic
    console.log('Downloading file:', filePath);
  }
  */
/*
  downloadFile(fileId: number) {
this.dossierService.downloadFileById(fileId).subscribe({
  next: (blob) => {
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;

    // Tentative d'extraction du nom original via content-disposition
    const contentDisposition = (blob as any).headers?.get?.('content-disposition');
    const match = contentDisposition?.match(/filename="?([^"]+)"?/);
    const fileName = match ? match[1] : `fichier_${fileId}`;

    link.download = fileName;
    link.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  },
  error: (err) => {
    console.error('Erreur lors du téléchargement du fichier', err);
  }
});
}
*/
/*
downloadFile(fileId: number) {
  this.dossierService.downloadFileById(fileId).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fichier_medical.jpg';  // You can adjust the file name if needed
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Download failed', err);
      // optionally show a user-friendly error message here
      this.error = 'Échec du téléchargement du fichier. Veuillez réessayer plus tard.';

    }
  });
}




getFileSize(filePath: string): string {
  // This would typically come from the API
  return 'N/A';
}

getFileIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return 'fas fa-file-pdf';
    case 'doc':
    case 'docx': return 'fas fa-file-word';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return 'fas fa-file-image';
    case 'xls':
    case 'xlsx': return 'fas fa-file-excel';
    default: return 'fas fa-file';
  }
}
}
*/




//before adding a delete file method
/*

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DossierMedicalService } from '../../services/dossier-medical.service';

export interface Patient {
  id?: number;
  nomFr: string;
  prenomFr: string;
  ipp: string;
  dateNaissance: Date;
  sexe: string;
}

export interface Departement {
  id: number;
  libelleFr: string;
  libelleAr?: string;
  abreviationFr?: string;
  abreviationAr?: string;
  reference?: string;
  status: number;
}

export interface TypeFichier {
  id: number;
  nom: string;
}

export interface FichierMedical {
  id: number;
  fileName: string;
  originalFileName?: string;
  filePath: string;
  dateCreation: Date;
  isInternal: boolean;
  typeFichier?: TypeFichier;
}

export interface DossierMedical {
  id: number;
  ipp: string;
  departementId: number;
  dateCreation: Date;
  patient?: Patient;
  departement?: Departement;
  fichiers?: FichierMedical[];
  nombreFichiers?: number;
}

@Component({
  selector: 'app-dossier-detail',
  templateUrl: './dossier-detail.component.html',
  styleUrls: ['./dossier-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DossierDetailComponent implements OnInit {
  @Input() fullDossier: DossierMedical | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dossierService: DossierMedicalService,

  ) { }

  ngOnInit(): void {
    // Component initialization logic
    this.loadFullDossier();
  }

  onClose(): void {
    this.close.emit();
  }

 
navigateToUpload(): void {
  console.log('Navigating to upload for dossier ID:', this.fullDossier?.id);
  if(this.fullDossier) {
  // Navigate to upload page with dossier ID and department ID
  this.router.navigate(['/upload', this.fullDossier.id], {
    queryParams: {
      departmentId: this.fullDossier.departement?.id,
      returnUrl: this.router.url
    }
  });
} else {
  console.error('Cannot navigate to upload, fullDossier is null');
}
  }


getFileIcon(fileName: string): string {
  const extension = fileName.toLowerCase().split('.').pop();

  switch (extension) {
    case 'pdf':
      return 'fas fa-file-pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'fas fa-file-image';
    case 'doc':
    case 'docx':
      return 'fas fa-file-word';
    case 'xls':
    case 'xlsx':
      return 'fas fa-file-excel';
    case 'txt':
      return 'fas fa-file-alt';
    default:
      return 'fas fa-file';
  }
}




downloadFile(fileId: number) {
  this.dossierService.downloadFileById(fileId).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fichier_medical.jpg';  // You can adjust the file name if needed
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Download failed', err);
      // optionally show a user-friendly error message here
      this.error = 'Échec du téléchargement du fichier. Veuillez réessayer plus tard.';

    }
  });
}


  private loadFullDossier() {
  if (!this.fullDossier || this.fullDossier.id == null) {
    this.error = 'Dossier médical non disponible.';
    return;
  }
  this.loading = true;
  this.dossierService.getDossierById(this.fullDossier.id).subscribe({
    next: (response) => {
      this.fullDossier = response.data;
      this.loading = false;
    },
    error: (error) => {
      this.error = error;
      this.loading = false;
    }
  });
}


isDoctor(): boolean {
  try {
    const userStr = localStorage.getItem('medicalapp_user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return user.role === 1;
  } catch {
    return false;
  }
}

isArchivist(): boolean {
  try {
    const userStr = localStorage.getItem('medicalapp_user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return user.role === 2;
  } catch {
    return false;
  }
}

isAdmin(): boolean {
  try {
    const userStr = localStorage.getItem('medicalapp_user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return user.role === 3;
  } catch {
    return false;
  }
}
}
*/



import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DossierMedicalService } from '../../services/dossier-medical.service';
import { NavigationComponent } from "../navigation/navigation.component";
import { FileService } from '../../services/file.service';

export interface Patient {
  id?: number;
  nomFr: string;
  prenomFr: string;
  ipp: string;
  dateNaissance: Date;
  sexe: string;
}

export interface Departement {
  id: number;
  libelleFr: string;
  libelleAr?: string;
  abreviationFr?: string;
  abreviationAr?: string;
  reference?: string;
  status: number;
}

export interface TypeFichier {
  id: number;
  nom: string;
}

export interface FichierMedical {
  id: number;
  fileName: string;
  originalFileName?: string;
  filePath: string;
  dateCreation: Date;
  isInternal: boolean;
  typeFichier?: TypeFichier;
}

export interface DossierMedical {
  id: number;
  ipp: string;
  departementId: number;
  dateCreation: Date;
  patient?: Patient;
  departement?: Departement;
  fichiers?: FichierMedical[];
  nombreFichiers?: number;
}

@Component({
  selector: 'app-dossier-detail',
  templateUrl: './dossier-detail.component.html',
  styleUrls: ['./dossier-detail.component.css'],
  standalone: true,
  imports: [CommonModule, NavigationComponent]
})
export class DossierDetailComponent implements OnInit {
  @Input() fullDossier: DossierMedical | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() close = new EventEmitter<void>();

  // Track which files are being deleted
  deletingFiles: Set<number> = new Set();
  dossierId: number | null = null;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dossierService: DossierMedicalService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    // Get the dossier ID from route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.dossierId = +id;
        this.loadDossierDetails(this.dossierId);
      }
    });
    // Component initialization logic
    this.loadFullDossier();
  }


  private loadDossierDetails(dossierId: number) {
    this.loading = true;
    this.error = null;

    // Assuming you have a method to get full dossier details by ID
    this.dossierService.getDossierById(dossierId).subscribe({
      next: (response) => {
        this.fullDossier = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des détails du dossier';
        this.loading = false;
      }
    });
  }

  onClose(): void {
    this.close.emit();
    // Navigate back to the previous page or a specific route
    //this.router.navigate(['../../'], { relativeTo: this.route });
    // Or navigate to a specific route like:
    //this.router.navigate(['/patients/search']);
  }

  /**
   * Navigate to the file upload page for this dossier
   */
  navigateToUpload(): void {
    console.log('Navigating to upload for dossier ID:', this.fullDossier?.id);
    if (this.fullDossier) {
      // Navigate to upload page with dossier ID and department ID
      this.router.navigate(['/upload', this.fullDossier.id], {
        queryParams: {
          departmentId: this.fullDossier.departement?.id,
          returnUrl: this.router.url
        }
      });
    } else {
      console.error('Cannot navigate to upload, fullDossier is null');
    }
  }

  /**
   * Get appropriate icon class for file type
   */
  getFileIcon(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop();

    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fas fa-file-image';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word';
      case 'xls':
      case 'xlsx':
        return 'fas fa-file-excel';
      case 'txt':
        return 'fas fa-file-alt';
      default:
        return 'fas fa-file';
    }
  }

  /**
   * Download a file by ID
   */
  /*
  downloadFile(fileId: number) {
    this.fileService.downloadFileById(fileId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fichier_medical.jpg';  // You can adjust the file name if needed
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
        // optionally show a user-friendly error message here
        this.error = 'Échec du téléchargement du fichier. Veuillez réessayer plus tard.';
      }
    });
  }
  */

  /**
   * Delete a file with confirmation
   */
  deleteFile(fichier: FichierMedical): void {
    // Show confirmation dialog
    const fileName = fichier.originalFileName || fichier.fileName;
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer le fichier "${fileName}" ?\n\nCette action est irréversible.`;

    if (confirm(confirmMessage)) {
      // Add file ID to deleting set to show loading state
      this.deletingFiles.add(fichier.id);

      // Call the delete service method
      this.fileService.deleteFileById(fichier.id).subscribe({
        next: (response) => {
          console.log('File deleted successfully', response);

          // Remove the file from the local array
          if (this.fullDossier && this.fullDossier.fichiers) {
            this.fullDossier.fichiers = this.fullDossier.fichiers.filter(f => f.id !== fichier.id);
          }

          // Remove from deleting set
          this.deletingFiles.delete(fichier.id);

          // Show success message (you can implement a toast/notification service)
          console.log('Fichier supprimé avec succès');
        },
        error: (err) => {
          console.error('Delete failed', err);

          // Remove from deleting set
          this.deletingFiles.delete(fichier.id);

          // Show error message
          this.error = 'Échec de la suppression du fichier. Veuillez réessayer plus tard.';

          // Clear error after 5 seconds
          setTimeout(() => {
            this.error = null;
          }, 5000);
        }
      });
    }
  }

  /**
   * Check if a file is currently being deleted
   */
  isDeleting(fileId: number): boolean {
    return this.deletingFiles.has(fileId);
  }

  private loadFullDossier() {
    if (!this.fullDossier || this.fullDossier.id == null) {
      this.error = 'Dossier médical non disponible.';
      return;
    }
    this.loading = true;
    this.dossierService.getDossierById(this.fullDossier.id).subscribe({
      next: (response) => {
        this.fullDossier = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  
  isDoctor(): boolean {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return user.role === 1;
    } catch {
      return false;
    }
  }

  isArchivist(): boolean {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return user.role === 2;
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return user.role === 3;
    } catch {
      return false;
    }
  }



  downloadFile(fileId: number) {
    this.fileService.downloadFileById(fileId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fichier_medical.jpg';  // You can adjust the file name if needed
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
        // optionally show a user-friendly error message here
        this.error = 'Échec du téléchargement du fichier. Veuillez réessayer plus tard.';

      }
    });
  }





  /**
     * Preview a file in a new tab/window
     */
  previewFile(fichier: FichierMedical): void {
    const fileName = fichier.originalFileName || fichier.fileName;

    console.log('Opening preview for file:', fileName);

    // Use the FileService to open the file preview
    this.fileService.openFilePreview(fichier.id, fileName);
  }

  /**
   * Check if file can be previewed in browser
   */
  isPreviewableFile(fileName: string): boolean {
    return this.fileService.isPreviewableFileType(fileName);
  }




































  

}