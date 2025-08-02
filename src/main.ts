
/*import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Import your routes
import { routes } from './app/app.routes'; // Create this file with your routes

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule), // Using HttpClientModule instead
    importProvidersFrom(ReactiveFormsModule),
  ]
}).catch(err => console.error(err));

*/




import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { PatientSearchComponent } from './app/components/patient-search/patient-search.component';
import { LoginComponent } from './app/components/auth/login/login.component';

// Check if we're in production
// import { environment } from './environments/environment';
// if (environment.production) {
//   enableProdMode();
// }

console.log('Starting Angular application...');

bootstrapApplication(AppComponent, {
  providers: [
    // Import essential modules
    importProvidersFrom(BrowserModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(ReactiveFormsModule),
    importProvidersFrom(FormsModule),
    
    // Provide router
    provideRouter(routes),
    
    /*provideRouter([
    
      { path: '', component: AppComponent },
      { path: 'patients', component: PatientSearchComponent },
      { path: 'login', component: LoginComponent },

    ])
    */
  ]
}).then(() => {
  console.log('Angular application started successfully');
}).catch(err => {
  console.error('Bootstrap error:', err);
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
});