import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Import dossier management components (create these components as needed)
/*
import { DossierCreateComponent } from '../../components/dossier-management/dossier-create/dossier-create.component';
import { DossierEditComponent } from '../../components/dossier-management/dossier-edit/dossier-edit.component';
import { DossierListComponent } from '../../components/dossier-management/dossier-list/dossier-list.component';
*/
const routes: Routes = [
  /*
  { path: '', component: DossierListComponent },
  { path: 'create', component: DossierCreateComponent },
  { path: 'edit/:id', component: DossierEditComponent }
  */
];

@NgModule({
  declarations: [
    /*
    DossierCreateComponent,
    DossierEditComponent,
    DossierListComponent
    */
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    // Add dossier management services here
    // DossierService, etc.
  ]
})
export class DossierManagementModule { }