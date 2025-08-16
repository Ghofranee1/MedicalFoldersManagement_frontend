import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TypeFichier } from '../../models/type-fichier.model';
import { FichierMedical } from '../../models/fichier-medical.model';
import { TypeFichierService } from '../../services/type-fichier.service';
import { FileService } from '../../services/file.service';

interface TypeFichierWithUsage extends TypeFichier {
  usageCount?: number;
  canDelete?: boolean;
}

interface TypeStatistics {
  totalTypes: number;
  typesInUse: number;
  unusedTypes: number;
  totalFiles: number;
  averageFilesPerType: number;
  mostUsedType: {
    nom: string;
    fileCount: number;
  };
}

@Component({
  selector: 'app-type-fichier-management',
  templateUrl: './type-fichier-management.component.html',
  styleUrls: ['./type-fichier-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TypeFichierManagementComponent implements OnInit {
  types: TypeFichierWithUsage[] = [];
  filteredTypes: TypeFichierWithUsage[] = [];
  allFiles: FichierMedical[] = [];
  statistics: TypeStatistics | null = null;

  // UI State
  loading = false;
  submitting = false;
  showModal = false;
  showDeleteModal = false;
  isEditMode = false;

  // Form
  typeForm!: FormGroup;
  currentType: TypeFichierWithUsage | null = null;
  typeToDelete: TypeFichierWithUsage | null = null;

  // Search and Filter
  searchTerm = '';
  filterType = 'all';

  // Messages
  errorMessage = '';
  successMessage = '';

  constructor(
    private typeFichierService: TypeFichierService,
    private fileService: FileService,
    private fb: FormBuilder
  ) {}

  private initializeForm(): void {
    this.typeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadTypesAndFiles();
  }

  loadTypesAndFiles(): void {
    this.loading = true;
    this.errorMessage = '';

    // Load both types and files simultaneously
    forkJoin({
      types: this.typeFichierService.getAllTypeFichier().pipe(
        catchError(error => {
          console.error('Error loading types:', error);
          return of([]);
        })
      ),
      files: this.getAllFiles().pipe(
        catchError(error => {
          console.error('Error loading files:', error);
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        this.allFiles = data.files as FichierMedical[];
        this.processTypesWithUsage(data.types);
        this.applyFilter();
        this.calculateStatistics();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.errorMessage = 'Erreur lors du chargement des données.';
        this.loading = false;
      }
    });
  }

  private getAllFiles() {
    // Since you mentioned you can't change the backend and the FileService doesn't have
    // a getAllFiles method, you'll need to implement this based on your backend API
    // This is a placeholder - you'll need to implement the actual method in your FileService
    // or call the appropriate endpoint here

    // Option 1: If you have departments and can get files by department
    // You might need to get all departments first, then get files for each department

    // Option 2: If you have a direct endpoint to get all files
    // return this.fileService.getAllFiles();

    // Option 3: If you need to implement a new method in FileService
    // For now, returning empty array as placeholder
    //return of([]);
    return this.fileService.getAllFiles();
    // TODO: Implement this method based on your actual API structure
    // You might need to add a new method to FileService like:
    // getAllFiles(): Observable<FichierMedical[]> {
    //   return this.http.get<FichierMedical[]>(`${this.apiUrl}/all`);
    // }
  }

  private processTypesWithUsage(types: TypeFichier[]): void {
    // Create a map to count files by type
    const typeUsageMap = new Map<number, number>();

    // Count files for each type
    this.allFiles.forEach(file => {
      if (file.typeFichierId) {
        const currentCount = typeUsageMap.get(file.typeFichierId) || 0;
        typeUsageMap.set(file.typeFichierId, currentCount + 1);
      }
    });

    // Process types with usage information
    this.types = types.map(type => ({
      ...type,
      usageCount: typeUsageMap.get(type.id) || 0,
      canDelete: !typeUsageMap.has(type.id) || typeUsageMap.get(type.id) === 0
    }));
  }

  calculateStatistics(): void {
    if (this.types.length > 0) {
      const totalTypes = this.types.length;
      const typesInUse = this.types.filter(t => (t.usageCount || 0) > 0).length;
      const unusedTypes = totalTypes - typesInUse;
      const totalFiles = this.types.reduce((sum, t) => sum + (t.usageCount || 0), 0);
      const averageFilesPerType = totalTypes > 0 ? Math.round((totalFiles / totalTypes) * 100) / 100 : 0;

      let mostUsedType = this.types[0];
      if (this.types.length > 1) {
        mostUsedType = this.types.reduce((max, t) =>
          (t.usageCount || 0) > (max.usageCount || 0) ? t : max
        );
      }

      this.statistics = {
        totalTypes,
        typesInUse,
        unusedTypes,
        totalFiles,
        averageFilesPerType,
        mostUsedType: {
          nom: mostUsedType?.nom || '',
          fileCount: mostUsedType?.usageCount || 0
        }
      };
    }
  }

  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = [...this.types];

    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(type =>
        type.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    switch (this.filterType) {
      case 'used':
        filtered = filtered.filter(type => (type.usageCount || 0) > 0);
        break;
      case 'unused':
        filtered = filtered.filter(type => (type.usageCount || 0) === 0);
        break;
      case 'recent':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(type => new Date(type.dateCreation) >= thirtyDaysAgo);
        break;
    }

    this.filteredTypes = filtered.sort((a, b) =>
      new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    );
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentType = null;
    this.typeForm.reset();
    this.showModal = true;
    this.clearMessages();
  }

  editType(type: TypeFichierWithUsage): void {
    this.isEditMode = true;
    this.currentType = type;
    this.typeForm.patchValue({
      nom: type.nom
    });
    this.showModal = true;
    this.clearMessages();
  }

  closeModal(): void {
    this.showModal = false;
    this.typeForm.reset();
    this.currentType = null;
    this.clearMessages();
  }

  /*
  onSubmit(): void {
    if (this.typeForm.valid) {
      this.submitting = true;
      this.clearMessages();

      const formData = this.typeForm.value;

      if (this.isEditMode && this.currentType) {
        const updatedType: TypeFichier = {
          id: this.currentType.id,
          nom: formData.nom,
          dateCreation: this.currentType.dateCreation
        };

        this.typeFichierService.updateTypeFichier(this.currentType.id, updatedType).subscribe({
          next: () => {
            this.successMessage = 'Type de fichier modifié avec succès.';
            this.closeModal();
            this.loadTypesAndFiles();
            this.submitting = false;
            this.hideMessageAfterDelay();
            
          },
          error: (error) => {
            console.error('Error updating type:', error);
            this.errorMessage = 'Erreur lors de la modification du type de fichier.';
            this.submitting = false;
          }
        });
      } else {
        const newType: TypeFichier = {
          id: 0,
          nom: formData.nom,
          dateCreation: new Date()
        };

        this.typeFichierService.createTypeFichier(newType).subscribe({
          next: (response) => {
            console.log('Type created:', response);
            this.successMessage = 'Type de fichier créé avec succès.';
            this.closeModal();
            this.loadTypesAndFiles();
            this.submitting = false;
            this.hideMessageAfterDelay();
          },
          error: (error) => {
            console.error('Error creating type:', error);
            this.errorMessage = 'Erreur lors de la création du type de fichier.';
            this.submitting = false;
          }
        });
      }
    }
  }
*/
  onSubmit(): void {
    if (this.typeForm.valid) {
      this.submitting = true;
      this.clearMessages();

      const formData = this.typeForm.value;

      if (this.isEditMode && this.currentType) {
        const updatedType: TypeFichier = {
          id: this.currentType.id,
          nom: formData.nom,
          dateCreation: this.currentType.dateCreation
        };

        this.typeFichierService.updateTypeFichier(this.currentType.id, updatedType).subscribe({
          next: () => {
            this.closeModal();
            this.loadTypesAndFiles();
            this.submitting = false;
            // Set success message AFTER closing modal
            this.successMessage = 'Type de fichier modifié avec succès.';
            this.hideMessageAfterDelay();
          },
          error: (error) => {
            console.error('Error updating type:', error);
            this.errorMessage = 'Erreur lors de la modification du type de fichier.';
            this.submitting = false;
          }
        });
      } else {
        const newType: TypeFichier = {
          id: 0,
          nom: formData.nom,
          dateCreation: new Date()
        };

        this.typeFichierService.createTypeFichier(newType).subscribe({
          next: (response) => {
            this.closeModal();
            this.loadTypesAndFiles();
            this.submitting = false;
            // Set success message AFTER closing modal
            this.successMessage = 'Type de fichier créé avec succès.';
            this.hideMessageAfterDelay();
          },
          error: (error) => {
            console.error('Error creating type:', error);
            this.errorMessage = 'Erreur lors de la création du type de fichier.';
            this.submitting = false;
          }
        });
      }
    }
  }
  confirmDelete(type: TypeFichierWithUsage): void {
    if (!type.canDelete) {
      this.errorMessage = 'Impossible de supprimer ce type car il est utilisé par des fichiers.';
      this.hideMessageAfterDelay();
      return;
    }

    this.typeToDelete = type;
    this.showDeleteModal = true;
    this.clearMessages();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.typeToDelete = null;
  }

  deleteType(): void {
    if (this.typeToDelete) {
      this.submitting = true;

      this.typeFichierService.deleteTypeFichier(this.typeToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Type de fichier supprimé avec succès.';
          this.closeDeleteModal();
          this.loadTypesAndFiles();
          this.submitting = false;
          this.hideMessageAfterDelay();
        },
        error: (error) => {
          console.error('Error deleting type:', error);
          this.errorMessage = 'Erreur lors de la suppression du type de fichier.';
          this.submitting = false;
        }
      });
    }
  }

  trackByFn(index: number, item: TypeFichierWithUsage): number {
    return item.id;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private hideMessageAfterDelay(): void {
    setTimeout(() => {
      this.clearMessages();
    }, 5000);
  }
}