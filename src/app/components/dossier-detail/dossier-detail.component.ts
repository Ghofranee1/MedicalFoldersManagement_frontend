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