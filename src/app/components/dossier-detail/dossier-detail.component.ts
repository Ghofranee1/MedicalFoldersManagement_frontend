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
   * Format file size for display
   */
  getFileSize(filePath: string): string {
    // This would typically come from the backend with the file info
    // For now, returning a placeholder
    return 'N/A';
  }

  /**
   * Download a file by ID
   */

  /*
  downloadFile(fileId: number): void {
    // Implement download logic here
    // This would typically call a service method
    console.log('Downloading file with ID:', fileId);

    // Example implementation:
    // this.fileService.downloadFile(fileId).subscribe({
    //   next: (blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'filename'; // You'd get the actual filename from the response
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    //   },
    //   error: (error) => {
    //     console.error('Download error:', error);
    //   }
    // });
  }
  */
  

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
}