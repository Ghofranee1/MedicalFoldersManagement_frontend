import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartementService } from '../../services/departement.service';
import { CommonModule } from '@angular/common';
import { DossierMedical } from '../../models/dossier-medical.model';

export interface Department {
  id: number;
      libelleFr: string;
      libelleAr?: string;
      abreviationFr?: string;
      abreviationAr?: string;
      reference?: string;
      status: number;
      dossiers?: DossierMedical[];
}

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
  
})
export class DepartmentManagementComponent implements OnInit {
  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  departmentForm: FormGroup;
  
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  showForm = false;
  editingDepartment: Department | null = null;
  searchTerm = '';

  constructor(
    private departementService: DepartementService,
    private fb: FormBuilder
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z0-9]+$/)]],
      description: ['', Validators.maxLength(500)],
      head: ['', Validators.maxLength(100)],
      location: ['', Validators.maxLength(200)],
      phoneNumber: ['', Validators.pattern(/^\+?[\d\s\-\(\)]+$/)],
      email: ['', Validators.email],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.error = null;

    this.departementService.getAllDepartements().subscribe({
      next: (departements) => {
        this.departments = departements;
        this.applySearch();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load departments. Please try again.';
        this.loading = false;
        console.error('Error loading departments:', error);
      }
    });
  }

  onSearch(): void {
    this.applySearch();
  }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDepartments = [...this.departments];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredDepartments = this.departments.filter(dept =>
        dept.libelleFr.toLowerCase().includes(term) ||
        dept.abreviationFr?.toLowerCase().includes(term) ||
        (dept.libelleFr && dept.reference?.toLowerCase().includes(term))
      );
    }
  }

  showCreateForm(): void {
    this.editingDepartment = null;
    this.showForm = true;
    this.departmentForm.reset({ status: 'active' });
    this.clearMessages();
  }

  editDepartment(department: Department): void {
    this.editingDepartment = department;
    this.showForm = true;
    this.departmentForm.patchValue(department);
    this.clearMessages();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingDepartment = null;
    this.departmentForm.reset();
    this.clearMessages();
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const departmentData = this.departmentForm.value;
    this.loading = true;
    this.clearMessages();

    if (this.editingDepartment) {
      // Update existing department
      this.departementService.updateDepartement(Number(this.editingDepartment.id), departmentData).subscribe({
        next: (updatedDepartment) => {
          const index = this.departments.findIndex(d => d.id === this.editingDepartment!.id);
          if (index !== -1) {
            this.departments[index] = updatedDepartment.data;
            this.applySearch();
          }
          this.success = 'Department updated successfully!';
          this.showForm = false;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to update department. Please try again.';
          this.loading = false;
          console.error('Update error:', error);
        }
      });
    } else {
      // Create new department
      this.departementService.createDepartement(departmentData).subscribe({
        next: (newDepartment) => {
          this.departments.unshift(newDepartment.data);
          this.applySearch();
          this.success = 'Department created successfully!';
          this.showForm = false;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to create department. Please try again.';
          this.loading = false;
          console.error('Create error:', error);
        }
      });
    }
  }

  deleteDepartment(department: Department): void {
    if (!confirm(`Are you sure you want to delete the department "${department.libelleFr}"? This action cannot be undone.`)) {
      return;
    }

    this.loading = true;
    this.clearMessages();

    this.departementService.deleteDepartement(department.id).subscribe({
      next: () => {
        this.departments = this.departments.filter(d => d.id !== department.id);
        this.applySearch();
        this.success = 'Department deleted successfully!';
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to delete department. Please try again.';
        this.loading = false;
        console.error('Delete error:', error);
      }
    });
  }

  toggleDepartmentStatus(department: Department): void {
    const newStatus = department.status === 1 ? 0 : 1;
    const action = newStatus === 1 ? 'activate' : 'deactivate';
    
    if (!confirm(`Are you sure you want to ${action} the department "${department.libelleFr}"?`)) {
      return;
    }

    this.loading = true;
    this.clearMessages();
/*
    this.departementService.updateDepartement(department.id, { ...department, status: newStatus }).subscribe({
      next: (updatedDepartment) => {
        const index = this.departments.findIndex(d => d.id === department.id);
        if (index !== -1) {
          this.departments[index] = updatedDepartment;
          this.applySearch();
        }
        this.success = `Department ${action}d successfully!`;
        this.loading = false;
      },
      error: (error) => {
        this.error = `Failed to ${action} department. Please try again.`;
        this.loading = false;
        console.error('Status update error:', error);
      }
    });
    */
  }

  markFormGroupTouched(): void {
    Object.keys(this.departmentForm.controls).forEach(key => {
      this.departmentForm.get(key)?.markAsTouched();
    });
  }

  clearMessages(): void {
    this.error = null;
    this.success = null;
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }
}