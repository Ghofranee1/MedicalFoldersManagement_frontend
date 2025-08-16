import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AdminUserManagementComponent } from '../admin-user-management/admin-user-management.component';

@Component({
  selector: 'app-admin-users',
  imports: [AdminUserManagementComponent],
  //templateUrl: './admin-users.component.html',
  template: '<app-admin-user-management></app-admin-user-management>',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {
  constructor(public authService: AuthService) { }
}
