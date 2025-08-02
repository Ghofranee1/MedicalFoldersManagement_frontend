
import { Component } from '@angular/core';
import { NavigationComponent } from "./components/navigation/navigation.component";
  
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from './components/auth/login/login.component';
  
@Component({
  selector: 'app-root',
  //templateUrl: './app.component.html',
  
  template: `
    <div class="app-container">
      <!--<app-navigation></app-navigation>-->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, CommonModule],
  
})
  

export class AppComponent {

  /*
    constructor(private http: HttpClient) {
      console.log('HttpClient injected successfully');
  }
  */
  title = 'medical-folders-management';
}



/*
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `<p>AppComponent loaded!</p>`,
})
export class AppComponent {
  constructor(private http: HttpClient) {
    console.log('HttpClient is injected ✔️');
  }
}

*/


//solution 1

/*
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <app-navigation *ngIf="showNavigation"></app-navigation>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, CommonModule],
})
export class AppComponent implements OnInit {
  title = 'medical-folders-management';
  showNavigation = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // Only show navigation after routing is established and on protected routes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide navigation on public routes
        const publicRoutes = ['/login', '/register', '/unauthorized'];
        this.showNavigation = !publicRoutes.some(route => event.url.startsWith(route));
      });
  }
}
  
*/
//solution 2
/*
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { filter, delay } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <app-navigation *ngIf="showNavigation && appInitialized"></app-navigation>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, CommonModule],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'medical-folders-management';
  showNavigation = false;
  appInitialized = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // Only show navigation after routing is established and on protected routes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        delay(0) // Ensure this runs after current execution cycle
      )
      .subscribe((event: NavigationEnd) => {
        // Hide navigation on public routes
        const publicRoutes = ['/login', '/register', '/unauthorized'];
        this.showNavigation = !publicRoutes.some(route => event.url.startsWith(route));
      });
  }

  ngAfterViewInit() {
    // Mark app as initialized after view is ready
    setTimeout(() => {
      this.appInitialized = true;
    }, 100);
  }
}

*/