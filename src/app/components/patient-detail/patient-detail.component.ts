
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DossierMedicalService } from '../../services/dossier-medical.service';
import { Patient } from '../../models/patient.model';
import { DossierMedical } from '../../models/dossier-medical.model';
import { CommonModule } from '@angular/common';
import { DossierDetailComponent } from "../dossier-detail/dossier-detail.component";
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
  standalone: true,
  imports: [CommonModule, DossierDetailComponent, RouterModule]
})
  


export class PatientDetailComponent implements OnInit {
  @Input() patient!: Patient;
  @Input() archivistDepartmentId!: number;
  @Output() close = new EventEmitter<void>();

  dossier: DossierMedical | null = null;
  dossiers: DossierMedical[] = [];
  loading = false;
  error: string | null = null;
  selectedDossier: DossierMedical | null = null;
  creatingDossier = false;
  currentUserDepartmentId: number = 0;
  dossierDetailLoading = false;
  dossierDetailError: string | null = null;

  constructor(private dossierService: DossierMedicalService, private authService: AuthService, private router: Router) {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.role === 2) {
      this.archivistDepartmentId = currentUser && typeof currentUser.departementId === 'number' ? currentUser.departementId : 0;
    } else if (currentUser && (currentUser.role === 1 || currentUser.role === 3)) {
      this.archivistDepartmentId = 0;
    }

    // Store current user's department ID for highlighting
    this.currentUserDepartmentId = currentUser?.departementId || 0;
  }

  ngOnInit() {
    if (this.patient && this.archivistDepartmentId != 0) {
      this.loadPatientDossierForDepartment();
      console.log('archivistDepartmentId:', this.archivistDepartmentId);
      console.log('role:', this.authService.getCurrentUser()?.role);
    } else if (this.patient && this.archivistDepartmentId == 0) {
      this.loadPatientDossiers();
    }
  }

  private loadPatientDossierForDepartment() {
    this.loading = true;
    this.error = null;

    this.dossierService.getDossierByPatientAndDepartement(this.patient.ipp, this.archivistDepartmentId ?? 1).subscribe({
      next: (response) => {
        this.dossier = response.data;
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.dossier = null;
        } else {
          this.error = 'Erreur lors du chargement du dossier';
        }
        this.loading = false;
      }
    });

    console.log('loaddossierfordepartement is called');
  }

  private loadPatientDossiers() {
    this.loading = true;
    this.dossierService.getDossiersByPatient(this.patient.ipp).subscribe({
      next: (response) => {
        this.dossiers = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  createDossier() {
    this.creatingDossier = true;
    this.error = null;

    const createRequest = {
      ipp: this.patient.ipp,
      departementId: this.archivistDepartmentId
    };

    this.dossierService.createDossier(createRequest).subscribe({
      next: (response) => {
        this.dossier = response.data;
        this.creatingDossier = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Erreur lors de la création du dossier';
        this.creatingDossier = false;
      }
    });
  }

  selectDossier(dossier: DossierMedical) {
    this.selectedDossier = dossier;
  }

  closeDossierDetail() {
    this.selectedDossier = null;
  }

  onClose() {
    this.close.emit();
  }

  getPatientAge(): number {
    const today = new Date();
    const birth = new Date(this.patient.dateNaissance);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  // New method to check if a dossier belongs to the current user's department
  isDoctorDepartment(dossier: DossierMedical): boolean {
    return this.isDoctor() && dossier.departement?.id === this.currentUserDepartmentId;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
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