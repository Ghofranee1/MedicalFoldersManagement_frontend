import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-layout',
  template: `
    <app-navigation></app-navigation>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-content {
      padding: 20px;
      margin-top: 60px; /* Adjust based on your navigation height */
    }
  `],
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavigationComponent]
})
export class LayoutComponent { }