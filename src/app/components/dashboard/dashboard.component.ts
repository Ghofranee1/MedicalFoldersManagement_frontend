import { Component, OnInit } from '@angular/core';
import { DossierMedicalService } from '../../services/dossier-medical.service';
import { PatientService } from '../../services/patient.service';
import { DepartementService } from '../../services/departement.service';
import { DossierStatistics } from '../../models/statistics.model';
import { Patient } from '../../models/patient.model';
import { Departement } from '../../models/departement.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, RouterModule], // Added RouterModule
  standalone: true
})
export class DashboardComponent implements OnInit {
  statistics: DossierStatistics | null = null;
  recentPatients: Patient[] = [];
  departements: Departement[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private dossierService: DossierMedicalService,
    private patientService: PatientService,
    private departementService: DepartementService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.loading = true;
        
    // Load statistics
    this.dossierService.getDossiersStatistics().subscribe({
      next: (response) => {
        this.statistics = response.data;
        console.log('Dossier Statistics:', this.statistics);
      },
      error: (error) => {
        this.error = error;
      }
    });

    // Load recent patients
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        const patients = response;
        if (Array.isArray(patients)) {
          this.recentPatients = patients.slice(0, 5);
        } else {
          console.error('PatientService: données inattendues', response);
          this.recentPatients = [];
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Erreur inconnue';
        this.loading = false;
      }
    });

    // Load departements
    this.departementService.getAllDepartements().subscribe({
      next: (response) => {
        console.log('Departements', response);
        this.departements = response;
      },
      error: (error) => {
        console.error('Error loading departements:', error);
      }
    });
  }

  getMonthName(monthNumber: number): string {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[monthNumber - 1];
  }
}