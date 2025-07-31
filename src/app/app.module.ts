import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DossierDetailComponent } from './components/dossier-detail/dossier-detail.component';
import { PatientSearchComponent } from './components/patient-search/patient-search.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { DatePipe } from '@angular/common';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { RouterOutlet } from '@angular/router';
import { DepartementService } from './services/departement.service';
import { DossierMedicalService } from './services/dossier-medical.service';
import { PatientService } from './services/patient.service';
// Import other components, services, or modules as needed

@NgModule({
  declarations: [
    // Add other components here
  ],
    imports: [
    AppComponent,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DatePipe,
    ReactiveFormsModule,    
    RouterOutlet,
    DashboardComponent,
    DossierDetailComponent,
    PatientDetailComponent,
    PatientSearchComponent,
    NavigationComponent,
    
],
  providers: [
      DossierMedicalService,
      PatientService,
      DepartementService,
      DatePipe
      // Add any services that need to be provided globally
      
  ],
  //bootstrap: [AppComponent]
})
export class AppModule { }