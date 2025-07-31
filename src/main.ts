/*import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
*/
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';


bootstrapApplication(AppComponent,{
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ]
})
  .catch(err => console.error(err));
  
