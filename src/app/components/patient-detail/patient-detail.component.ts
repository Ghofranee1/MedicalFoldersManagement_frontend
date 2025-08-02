/*
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DossierMedicalService } from '../../services/dossier-medical.service';
import { Patient } from '../../models/patient.model';
import { DossierMedical } from '../../models/dossier-medical.model';
import { CommonModule } from '@angular/common';
import { DossierDetailComponent } from "../dossier-detail/dossier-detail.component";
//import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
  standalone: true,
  imports: [CommonModule, DossierDetailComponent]

})
export class PatientDetailComponent implements OnInit {
  @Input() patient!: Patient;
  @Output() close = new EventEmitter<void>();

  dossiers: DossierMedical[] = [];
  loading = false;
  error: string | null = null;
  selectedDossier: DossierMedical | null = null;

  constructor(private dossierService: DossierMedicalService) {}

  ngOnInit() {
    if (this.patient) {
      this.loadPatientDossiers();
    }
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
}
  */

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DossierMedicalService } from '../../services/dossier-medical.service';
import { Patient } from '../../models/patient.model';
import { DossierMedical } from '../../models/dossier-medical.model';
import { CommonModule } from '@angular/common';
import { DossierDetailComponent } from "../dossier-detail/dossier-detail.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
  standalone: true,
  imports: [CommonModule, DossierDetailComponent]
})
export class PatientDetailComponent implements OnInit {
  @Input() patient!: Patient;
  @Input() archivistDepartmentId!: number; // Department ID of the logged-in archivist
  @Output() close = new EventEmitter<void>();

  dossier: DossierMedical | null = null; // Single dossier for this department
  dossiers: DossierMedical[] = [];
  loading = false;
  error: string | null = null;
  selectedDossier: DossierMedical | null = null;
  creatingDossier = false;
  //archivistDepartmentId: number | undefined = 1; // This should come from your auth service
  currentUserDepartmentId: number = 0; // This should come from your auth service
  dossierDetailLoading = false;
  dossierDetailError: string | null = null;
  constructor(private dossierService: DossierMedicalService, private authService: AuthService
  ) {
    
    const currentUser = this.authService.getCurrentUser();


    if (currentUser && currentUser.role === 2) {
      this.archivistDepartmentId = currentUser && typeof currentUser.departementId === 'number' ? currentUser.departementId : 0;
    } else if (currentUser && (currentUser.role === 1 || currentUser.role === 3)) {
      this.archivistDepartmentId = 0; // the user is a doctor or admin, no specific department
    }
    
   }

  ngOnInit() {
    if (this.patient && this.archivistDepartmentId != 0) {
      this.loadPatientDossierForDepartment();
      //console.log('Patient Detail Component Initialized', this.patient);
      console.log('archivistDepartmentId:', this.archivistDepartmentId);
      console.log('role:', this.authService.getCurrentUser()?.role);
    } else if (this.patient && this.archivistDepartmentId == 0) {
      this.loadPatientDossiers();
      console.log('Patient Detail Component Initialized', this.patient);
    }
    
  }

  private loadPatientDossierForDepartment() {
    this.loading = true;
    this.error = null;

    // Get dossier for specific patient and department
    this.dossierService.getDossierByPatientAndDepartement(this.patient.ipp, this.archivistDepartmentId ?? 1 ).subscribe({
      next: (response) => {
        this.dossier = response.data;
        this.loading = false;
      },
      error: (error) => {
        // If 404, it means no dossier exists for this patient in this department
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
        //this.dossier = this.dossiers[0];
        console.log('le premier dossier du patient est', this.dossier);
        this.loading = false;
        console.log('les dossiers du patient d ipp ', this.patient.ipp, 'est', this.dossiers);

      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
    console.log('loadPatientDossiers is called');
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
        // Optionally show success message
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




}