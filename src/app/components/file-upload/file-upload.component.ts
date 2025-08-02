import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../services/file.service';
import { DepartementService } from '../../services/departement.service';
import { CommonModule } from '@angular/common';
import { PatientDetailComponent } from '../patient-detail/patient-detail.component';

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface FileUploadData {
  file: File;
  fileName: string;
  description: string;
  departmentId: string;
  category: string;
  tags: string[];
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],

})
export class FileUploadComponent implements OnInit {
  uploadForm: FormGroup;
  departments: Department[] = [];
  selectedFiles: File[] = [];
  departmentId: string | null = null;
  uploading = false;
  uploadProgress = 0;
  error: string | null = null;
  success = false;

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

  categories = [
    'Medical Report',
    'Lab Result',
    'X-Ray',
    'MRI Scan',
    'CT Scan',
    'Prescription',
    'Consultation Note',
    'Administrative',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private departmentService: DepartementService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(500)]],
      departmentId: ['', Validators.required],
      category: ['', Validators.required],
      tags: ['']
    });
  }

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('departmentId');
    this.loadDepartments();
    
    if (this.departmentId) {
      this.uploadForm.patchValue({ departmentId: this.departmentId });
      this.uploadForm.get('departmentId')?.disable();
    }
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartements().subscribe({
      next: (departments) => {
        this.departments = departments.map(dep => ({
          ...dep,
          id: dep.id.toString()
        }));
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.error = 'Failed to load departments.';
      }
    });
  }

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

  onSubmit(): void {
    if (this.uploadForm.invalid || this.selectedFiles.length === 0) {
      this.markFormGroupTouched();
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.error = null;

    const formData = this.uploadForm.value;
    const tags = formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [];

    const uploadPromises = this.selectedFiles.map((file, index) => {
      const fileData: FileUploadData = {
        file,
        fileName: file.name,
        description: formData.description,
        departmentId: formData.departmentId || this.departmentId!,
        category: formData.category,
        tags
      };

      return this.fileService.uploadFile(fileData).toPromise();
    });

    Promise.all(uploadPromises)
      .then(() => {
        this.success = true;
        this.uploading = false;
        this.uploadProgress = 100;
        this.resetForm();
        
        setTimeout(() => {
          this.router.navigate(['../'], { relativeTo: this.route });
        }, 2000);
      })
      .catch((error) => {
        this.error = 'Failed to upload files. Please try again.';
        this.uploading = false;
        this.uploadProgress = 0;
        console.error('Upload error:', error);
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
    if (this.departmentId) {
      this.uploadForm.patchValue({ departmentId: this.departmentId });
    }
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}