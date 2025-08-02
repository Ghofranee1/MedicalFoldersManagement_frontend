import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Import patient-related components
import { PatientSearchComponent } from '../../components/patient-search/patient-search.component';
import { PatientDetailComponent } from '../../components/patient-detail/patient-detail.component';
//import { PatientListComponent } from '../../components/patient-list/patient-list.component'; // Create this if needed
import { PatientService } from '../../services/patient.service';

const routes: Routes = [
  { path: '', component: PatientSearchComponent },
  { path: 'search', component: PatientSearchComponent },
  //{ path: 'list', component: PatientListComponent },
  { path: ':ipp', component: PatientDetailComponent }
];

@NgModule({
  declarations: [
    // Remove PatientSearchComponent and PatientDetailComponent from here
    // if they're already declared in AppModule
    // PatientSearchComponent,
    // PatientDetailComponent,
    // PatientListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    // Add patient-related services here
    // PatientService, etc.
    PatientService
  ]
})
export class PatientsModule { }