import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../services/file.service';
import { DepartementService } from '../../services/departement.service';
import { TypeFichierService } from '../../services/type-fichier.service';
import { CommonModule, Location } from '@angular/common';
import { TypeFichier } from '../../models/type-fichier.model';

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface UploadFileRequest {
  file: File;
  dossierId: number;
  typeFichierId?: number;
  isInternal: boolean;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class FileUploadComponent implements OnInit {
  @Input() archivistDepartmentId!: number;
  uploadForm: FormGroup;
  selectedFiles: File[] = [];
  dossierId: number | null = null;
  uploading = false;
  uploadProgress = 0;
  error: string | null = null;
  success = false;

  // File types from service
  fileTypes: TypeFichier[] = [];
  loadingFileTypes = false;

  // File validation
  maxFileSize = 50 * 1024 * 1024; // 50MB
  allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private departmentService: DepartementService,
    private typeFichierService: TypeFichierService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    // Simplified form - removed departmentId since it's automatic
    this.uploadForm = this.fb.group({
      dossierId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      typeFichierId: [''],
      isInternal: [false]
    });
  }

  ngOnInit(): void {
    // Get dossierId from route parameters
    const dossierIdParam = this.route.snapshot.paramMap.get('dossierId');
    this.dossierId = dossierIdParam ? parseInt(dossierIdParam) : null;

    // If dossierId is provided via route, remove it from form validation
    if (this.dossierId) {
      this.uploadForm.removeControl('dossierId');
    }

    // Load file types from service
    this.loadFileTypes();
  }

  /**
   * Load file types from the TypeFichierService
   */
  private loadFileTypes(): void {
    this.loadingFileTypes = true;
    this.typeFichierService.getAllTypeFichier().subscribe({
      next: (types: TypeFichier[]) => {
        this.fileTypes = types;
        this.loadingFileTypes = false;
      },
      error: (error) => {
        console.error('Error loading file types:', error);
        this.error = 'Failed to load file types. Please refresh the page.';
        this.loadingFileTypes = false;

        // Fallback to static types if service fails
        //this.fileTypes = this.getDefaultFileTypes();
      }
    });
  }

  /**
   * Fallback method to provide default file types if service fails
   */
  /*
  private getDefaultFileTypes(): TypeFichier[] {
    return [
      { id: 1, nom: 'Radio', dateCreation: new Date() },
      { id: 2, nom: 'écho', dateCreation: new Date() },
      { id: 3, nom: 'scanner', dateCreation: new Date() },
      { id: 4, nom: 'IRM', dateCreation: new Date() },
      { id: 21, nom: 'X-Ray', dateCreation: new Date() },
      { id: 22, nom: 'MRI Scan', dateCreation: new Date() },
      { id: 23, nom: 'Prescription', dateCreation: new Date() },
      { id: 24, nom: 'Consultation Note', dateCreation: new Date() },
      { id: 25, nom: 'Administrative', dateCreation: new Date() }
    ];
  }
  */

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    this.error = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!this.validateFile(file)) {
        continue;
      }

      this.selectedFiles.push(file);
    }
  }

  validateFile(file: File): boolean {
    // Check file size
    if (file.size > this.maxFileSize) {
      this.error = `File "${file.name}" is too large. Maximum size is 50MB.`;
      return false;
    }

    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      this.error = `File type "${file.type}" is not allowed.`;
      return false;
    }

    return true;
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  getFileIcon(file: File): string {
    if (file.type.startsWith('image/')) return 'fas fa-image';
    if (file.type.includes('pdf')) return 'fas fa-file-pdf';
    if (file.type.includes('word')) return 'fas fa-file-word';
    if (file.type.includes('excel') || file.type.includes('sheet')) return 'fas fa-file-excel';
    return 'fas fa-file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Custom validation method for the upload button
  isFormValid(): boolean {
    // If dossierId is from route, we don't need form validation for it
    if (this.dossierId) {
      return true; // Only need files to be selected, which is checked separately
    }

    // If dossierId needs to be entered manually, validate the form
    return this.uploadForm.valid;
  }

  onSubmit(): void {
    // Check if we have files
    if (this.selectedFiles.length === 0) {
      this.error = 'Please select at least one file to upload.';
      return;
    }

    // Get dossierId - either from route or form
    let dossierId = this.dossierId;
    if (!dossierId) {
      if (this.uploadForm.invalid) {
        this.markFormGroupTouched();
        return;
      }
      dossierId = this.uploadForm.get('dossierId')?.value;
    }

    if (!dossierId) {
      this.error = 'Dossier ID is required.';
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.error = null;

    const formData = this.uploadForm.value;

    // Upload files sequentially to track progress
    this.uploadFilesSequentially(0, { ...formData, dossierId });
    if (this.uploading) return;
    this.uploading = true;

    // Simulate upload API call
    setTimeout(() => {
      this.uploading = false;
      this.success = true;
      this.error = null;

      // Message disappears after 20s
      setTimeout(() => {
        this.success = false;
      }, 20000);

 
    }, 2000);
  }

  private uploadFilesSequentially(index: number, formData: any): void {
    if (index >= this.selectedFiles.length) {
      // All files uploaded successfully
      this.success = true;
      this.uploading = false;
      this.uploadProgress = 100;
      this.resetForm();

      
      
      return;
    }

    const file = this.selectedFiles[index];

    // Create FormData that matches UploadFileRequest
    const uploadFormData = new FormData();
    uploadFormData.append('File', file);
    uploadFormData.append('DossierId', formData.dossierId.toString());
    uploadFormData.append('IsInternal', (formData.isInternal || false).toString());

    if (formData.typeFichierId && formData.typeFichierId !== '') {
      uploadFormData.append('TypeFichierId', formData.typeFichierId.toString());
    }

    this.fileService.uploadFile(uploadFormData).subscribe({
      next: (response) => {
        // Update progress
        this.uploadProgress = Math.round(((index + 1) / this.selectedFiles.length) * 100);

        // Upload next file
        this.uploadFilesSequentially(index + 1, formData);
      },
      error: (error) => {
        this.error = `Failed to upload file "${file.name}". Please try again.`;
        this.uploading = false;
        this.uploadProgress = 0;
        console.error('Upload error:', error);
      }
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.uploadForm.controls).forEach(key => {
      this.uploadForm.get(key)?.markAsTouched();
    });
  }

  resetForm(): void {
    this.uploadForm.reset();
    this.selectedFiles = [];
  }

  cancel(): void {
    this.router.navigate(['/patients/search'], { relativeTo: this.route });
  }

  getUserDepartmentId(): number {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return 0;
      const user = JSON.parse(userStr);
      return user.departementId;
    } catch {
      return 0;
    }
  }

  getUserDepartmentName(): string {
    try {
      const userStr = localStorage.getItem('medicalapp_user');
      if (!userStr) return 'department inconnu';
      const user = JSON.parse(userStr);
      return user.departementName;
    } catch {
      return 'department inconnu';
    }
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