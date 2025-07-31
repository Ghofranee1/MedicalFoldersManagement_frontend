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