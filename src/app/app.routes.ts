import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientSearchComponent } from './components/patient-search/patient-search.component';
import { DossierDetailComponent } from './components/dossier-detail/dossier-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientSearchComponent },
  { path: 'dossiers', component: DossierDetailComponent },
  { path: '**', redirectTo: '/dashboard' }
];
