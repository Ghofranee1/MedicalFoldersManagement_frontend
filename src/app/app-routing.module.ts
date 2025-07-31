import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientSearchComponent } from './components/patient-search/patient-search.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DossierDetailComponent } from './components/dossier-detail/dossier-detail.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { NavigationComponent } from './components/navigation/navigation.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientSearchComponent },
  { path: 'dossiers', component: DossierDetailComponent },
  
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  exports: [RouterModule],
  imports: [
    //HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppRoutingModule { }