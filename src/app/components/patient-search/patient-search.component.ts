import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientDetailComponent } from "../patient-detail/patient-detail.component";
import { AuthService } from '../../services/auth.service';
//import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PatientDetailComponent],
})
export class PatientSearchComponent implements OnInit {
  searchForm: FormGroup;
  patients: Patient[] = [];
  loading = false;
  error: string | null = null;
  selectedPatient: Patient | null = null;
  currentUserDepartmentId: number | undefined = 0; // This should come from your auth service
  nombreDossiersDepartement: number = 0;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private authService: AuthService,
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });

    // Get the current user's department ID from your authentication service
    const currentUser = this.authService.getCurrentUser();
    console.log('Current User:', currentUser);
    if (currentUser && currentUser.role === 2) {
      this.currentUserDepartmentId = currentUser.departementId;
    }
    console.log('Current User Department ID:', this.currentUserDepartmentId);

  }

  ngOnInit() {
    this.setupSearch();
    this.loadAllPatients();
  }

  private setupSearch() {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(searchTerm => {
          if (searchTerm && searchTerm.trim().length > 0) {
            this.loading = true;
            return this.patientService.searchPatients(searchTerm.trim());
          } else {
            return this.patientService.getAllPatients();
          }
        })
      )
      .subscribe({
        next: (response) => {
          this.patients = response;
          this.loading = false;
          this.error = null;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
          this.patients = [];
        }
      });
  }

  private loadAllPatients() {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        this.patients = response;
        response.forEach((patient) => this.loadPatientFolderCount(patient));
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  selectPatient(patient: Patient) {
    this.selectedPatient = patient;
  }

  clearSelection() {
    this.selectedPatient = null;
  }

  getPatientAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

/*
  getPatientDossiersCount(patient: Patient): String {
    this.patientService.getPatientFolderscount(this.currentUserDepartmentId!, Number(patient.ipp)).subscribe({
      next: (res) => {
        //this.nombreDossiersDepartement = count;
        this.patientFolderCounts[patient.ipp] = res.data?.nombreFichiers ?? 0;
        //if (res.data?.nombreFichiers !== undefined) {
      },
      error: (error: any) => {
        console.error('Error fetching patient dossiers count:', error);
        //this.nombreDossiersDepartement = patient.dossiers?.length ?? 0;
        this.patientFolderCounts[patient.ipp] = patient.dossiers?.length ?? 0;
      }
    });
    
    return this.nombreDossiersDepartement.toString();
  }
*/


  // In your component
  patientFolderCounts: { [ipp: string]: number } = {};

  loadPatientFolderCount(patient: Patient) {
    
    this.patientService
      .getPatientFichierscount(this.currentUserDepartmentId!, Number(patient.ipp))
      .subscribe({
        next: (res) => {
          if (this.currentUserDepartmentId! !== 0) {
            if (patient.dossiers && patient.dossiers.length > 0) {
              this.patientFolderCounts[patient.ipp] = res.data?.nombreFichiers ?? 0;
            } else {
              this.patientFolderCounts[patient.ipp] = 0;
            }
          } else {
            //here we are going to sum up all the nobreFichiers of the dossiers
            //for each data item in the res.data array we're going to take the nombrefichiers and sum them up
            const totalFiles = res.data.reduce((sum: number, dossier: any) => {
              return sum + (dossier.nombreFichiers || 0);
            }, 0);
            this.patientFolderCounts[patient.ipp] = totalFiles;
            
          }
        },
        error: () => {
          this.patientFolderCounts[patient.ipp] = 0;
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