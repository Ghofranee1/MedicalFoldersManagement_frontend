import { Component } from '@angular/core';
import { Router } from '@angular/router';
//import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  //imports: [RouterModule] 
})
export class NavigationComponent {
  constructor(private router: Router) {}

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}