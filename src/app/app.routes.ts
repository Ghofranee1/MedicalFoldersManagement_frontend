/*
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

// Import components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientSearchComponent } from './components/patient-search/patient-search.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { DossierDetailComponent } from './components/dossier-detail/dossier-detail.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized/unauthorized.component';

export const routes: Routes = [
  // Public routes
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'unauthorized', 
    component: UnauthorizedComponent 
  },

  // Protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  // Patient search - accessible by both doctors and archivists
  {
    path: 'patients/search',
    component: PatientSearchComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [UserRole.Doctor, UserRole.Archivist] }
  },

  // Patient detail - accessible by both doctors and archivists
  {
    path: 'patients/:ipp',
    component: PatientDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [UserRole.Doctor, UserRole.Archivist] }
  },

  // Dossier detail - accessible by both doctors and archivists
  {
    path: 'dossiers/:id',
    component: DossierDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [UserRole.Doctor, UserRole.Archivist] }
  },

  // Doctor-only routes with lazy loading
  {
    path: 'patients',
    loadChildren: () => import('./modules/patients/patients.module').then(m => m.PatientsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [UserRole.Doctor] }
  },

  // Archivist-only routes with lazy loading
  {
    path: 'departments/:departmentId/files',
    loadChildren: () => import('./modules/files/files.module').then(m => m.FilesModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [UserRole.Archivist] }
  },

  {
    path: 'dossiers/create',
    loadChildren: () => import('./modules/dossier-management/dossier-management.module').then(m => m.DossierManagementModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [UserRole.Archivist] }
  },

  // Default redirects
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];

*/

/*

import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

// Import components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientSearchComponent } from './components/patient-search/patient-search.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { DossierDetailComponent } from './components/dossier-detail/dossier-detail.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized/unauthorized.component';

export const routes: Routes = [
  // Public routes (no layout)
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },

  // Protected routes (with layout)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'patients/search',
        component: PatientSearchComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Doctor, UserRole.Archivist] }
      },
      {
        path: 'patients/:ipp',
        component: PatientDetailComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Doctor, UserRole.Archivist] }
      },
      {
        path: 'dossiers/:id',
        component: DossierDetailComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Doctor, UserRole.Archivist] }
      },
      // Lazy loaded routes
      {
        path: 'patients',
        loadChildren: () => import('./modules/patients/patients.module').then(m => m.PatientsModule),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Doctor] }
      },
      {
        path: 'departments/:departmentId/files',
        loadChildren: () => import('./modules/files/files.module').then(m => m.FilesModule),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Archivist] }
      },
      {
        path: 'dossiers/create',
        loadChildren: () => import('./modules/dossier-management/dossier-management.module').then(m => m.DossierManagementModule),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Archivist] }
      },
      
    ]
  },

  // Default redirects
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
*/


import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

// Import components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientSearchComponent } from './components/patient-search/patient-search.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { DossierDetailComponent } from './components/dossier-detail/dossier-detail.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized/unauthorized.component';
//import { FileTypeManagementComponent } from './components/file-type-management/file-type-management.component';
import { TypeFichierManagementComponent } from './components/type-fichier-management/type-fichier-management.component';
import { AdminUserManagementComponent } from './components/admin-user-management/admin-user-management.component';

export const routes: Routes = [
  // Public routes (no layout)
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },

  /*
  {
    path: 'dossier-detail/:id',
    component: DossierDetailComponent,
  },
  */
  // Protected routes (with layout)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'patients/search',
        component: PatientSearchComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Doctor, UserRole.Archivist, UserRole.Admin] }
      },
      {
        path: 'patients/:ipp',
        component: PatientDetailComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Doctor, UserRole.Archivist, UserRole.Admin] }
      },
      /*
      {
        path: 'dossiers/:id',
        component: DossierDetailComponent,
        
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Doctor, UserRole.Archivist, UserRole.Admin] }
      },
      */
      
      {
        path: 'dossier-detail/:id',
        component: DossierDetailComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Doctor, UserRole.Archivist, UserRole.Admin] }
      },
      // File upload route - accessible by archivists (who manage files)
      {
        path: 'upload/:dossierId',
        component: FileUploadComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Archivist, UserRole.Admin] }
      },
      // Alternative upload route without dossier ID (general upload)
      {
        path: 'upload',
        component: FileUploadComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Archivist, UserRole.Admin] }
      },
      // Lazy loaded routes
      {
        path: 'patients',
        loadChildren: () => import('./modules/patients/patients.module').then(m => m.PatientsModule),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Doctor, UserRole.Admin]}
      },
      {
        path: 'departments/:departmentId/files',
        loadChildren: () => import('./modules/files/files.module').then(m => m.FilesModule),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Archivist, UserRole.Admin] }
      },
      {
        path: 'dossiers/create',
        loadChildren: () => import('./modules/dossier-management/dossier-management.module').then(m => m.DossierManagementModule),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Archivist, UserRole.Admin] }
      },
      {
        path: 'patients/:ipp/upload/:dossierId',
        component: FileUploadComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Archivist, UserRole.Admin] }
      },
      {
        path: 'login',
        component: LoginComponent
      },
      /*
      {
        path: 'manage-types',
        component: FileTypeManagementComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Admin] }
      },
      //this didn't work
      {
        path: 'manage-types-version-2',
        component: TypeFichierManagementComponent,
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Admin] }
      }
      
      */
      {
        path: 'manage-types-version-2',
        loadComponent: () =>
          import('./components/type-fichier-management/type-fichier-management.component')
            .then(m => m.TypeFichierManagementComponent),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Admin] }
      },
      {
        path: 'admin-user-management',
        loadComponent: () =>
          import('./components/admin-user-management/admin-user-management.component')
            .then(m => m.AdminUserManagementComponent),
        canActivate: [RoleGuard],
        data: { allowedRoles: [UserRole.Admin] }
      },
      

    ]
  }
];