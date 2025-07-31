import { Component } from '@angular/core';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { AppRoutingModule } from "./app-routing.module";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [RouterModule, NavigationComponent /*, AppRoutingModule*/],
  template: `
    <app-navigation></app-navigation>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'medical-folders-management';
}
