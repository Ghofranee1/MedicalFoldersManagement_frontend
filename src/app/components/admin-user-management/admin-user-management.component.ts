import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserDto, RegisterRequest, UpdateUserRequest, ChangePasswordRequest, UpdateRoleRequest, UserRole, User } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Departement } from '../../models/departement.model';
import { DepartementService } from '../../services/departement.service';

interface FormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departementId?: number;
  password: string;
  newPassword: string;
  confirmPassword: string;
  currentPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

interface AvailabilityCheck {
  checking: boolean;
  available: boolean;
}

interface UserStats {
  total: number;
  doctors: number;
  archivists: number;
  admins: number;
  active: number;
}

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css'],
  imports: [FormsModule, CommonModule] 

})
export class AdminUserManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // State management
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  error = '';
  actionLoading = false;

  // Search and filter states
  searchTerm = '';
  selectedRole = 'all';
  selectedDepartment = 'all';
  showFilters = false;

  // Modal states
  selectedUser: UserDto | null = null;
  showModal = false;
  modalType: 'create' | 'edit' | 'password' | 'delete' = 'create';
  modalLoading = false;
  modalError = '';

  // Form states
  formData: FormData = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.Doctor,
    departementId: undefined,
    password: '',
    newPassword: '',
    confirmPassword: '',
    currentPassword: ''
  };

  formErrors: FormErrors = {};
  availabilityCheck: AvailabilityCheck = { checking: false, available: true };

  // Enum references for template
  UserRole = UserRole;



  departments: Departement[] = [];
  isLoadingDepartments = false;

  constructor(private authService: AuthService, private router: Router, private departementService: DepartementService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // API Functions
  async loadUsers(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';

      this.authService.getAllUsers()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (users) => {
            console.log('Loaded users:', users);
            this.users = users;
            for (const user of this.users) {
              if (user.departementName) {
                console.log(`User ${user.username} has department: ${user.departementName}`);
              } else {
                console.log(`User ${user.username} has no department assigned`);
              }
            }
            this.applyFilters();
            this.loading = false;
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to load users';
            this.loading = false;
            console.error('Error loading users:', err);
          }
        });
    } catch (err: any) {
      this.error = err.error?.message || 'Failed to load users';
      this.loading = false;
    }
  }

  async checkUsernameAvailability(username: string, email: string): Promise<void> {
    if (!username || !email) return;

    this.availabilityCheck = { checking: true, available: true };

    this.authService.checkAvailability(username, email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          console.log('Availability check result:', result);
          this.availabilityCheck = {
            checking: false,
            available: result.available === 1
          };
        },
        error: () => {
          this.availabilityCheck = { checking: false, available: true };
        }
      });
  }

  // Filter and search functions
  applyFilters(): void {
    let filtered = [...this.users];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term)
      );
    }

    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === parseInt(this.selectedRole));
    }

    if (this.selectedDepartment !== 'all') {
      filtered = filtered.filter(user => user.departementId === parseInt(this.selectedDepartment));
    }

    this.filteredUsers = filtered;
    console.log('Filtered users:', this.filteredUsers);
  }

  /*
  onSearchChange(): void {
    this.applyFilters();
  }
  */

  onRoleFilterChange(): void {
    this.applyFilters();
  }

  onDepartmentFilterChange(): void {
    this.applyFilters();
  }

  // Form validation
  /*
  validateForm(): boolean {
    this.formErrors = {};

    if (!this.formData.firstName.trim()) {
      this.formErrors['firstName'] = 'First name is required';
    }
    if (!this.formData.lastName.trim()) {
      this.formErrors['lastName'] = 'Last name is required';
    }
    if (!this.formData.username.trim()) {
      this.formErrors['username'] = 'Username is required';
    }
    if (!this.formData.email.trim()) {
      this.formErrors['email'] = 'Email is required';
    }
    if (this.formData.email && !this.formData.email.includes('@')) {
      this.formErrors['email'] = 'Invalid email format';
    }

    if (this.modalType === 'create' || this.modalType === 'password') {
      if (!this.formData.newPassword) {
        this.formErrors['newPassword'] = 'Password is required';
      }
      if (this.formData.newPassword !== this.formData.confirmPassword) {
        this.formErrors['confirmPassword'] = 'Passwords do not match';
      }
      if (this.formData.newPassword && this.formData.newPassword.length < 6) {
        this.formErrors['newPassword'] = 'Password must be at least 6 characters';
      }
    }

    if ((this.formData.role === UserRole.Doctor || this.formData.role === UserRole.Archivist) && !this.formData.departementId) {
      this.formErrors['departementId'] = 'Department is required for this role';
    }

    return Object.keys(this.formErrors).length === 0;
  }
  */
  // Modal handlers
  openModal(type: 'create' | 'edit' | 'password' | 'delete', user?: UserDto): void {
    this.modalType = type;
    this.selectedUser = user || null;
    this.modalError = '';
    this.formErrors = {};
    this.availabilityCheck = { checking: false, available: true };

    if (user) {
      this.formData = {
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || UserRole.Doctor,
        departementId: user.departementId || undefined,
        password: '',
        newPassword: '',
        confirmPassword: '',
        currentPassword: ''
      };
    } else {
      this.formData = {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role: UserRole.Doctor,
        departementId: undefined,
        password: '',
        newPassword: '',
        confirmPassword: '',
        currentPassword: ''
      };
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
    this.modalError = '';
    this.formErrors = {};
    this.modalLoading = false;
  }

  /*
  onFormChange(field: keyof FormData, value: any): void {
    this.formData[field] = value;
    // Clear specific field error when user starts typing
    if (this.formErrors[field]) {
      delete this.formErrors[field];
    }

    // Check availability for new users
    if (this.modalType === 'create' && (field === 'username' || field === 'email')) {
      if (this.formData.username && this.formData.email) {
        this.checkUsernameAvailability(this.formData.username, this.formData.email);
      }
    }
  }
  */
  
  onFormChange<K extends keyof FormData>(field: K, value: FormData[K]): void {
    this.formData[field] = value;
    if (this.formErrors[field]) {
      delete this.formErrors[field];
    }

    if (this.modalType === 'create' && (field === 'username' || field === 'email')) {
      if (this.formData.username && this.formData.email) {
        this.checkUsernameAvailability(this.formData.username, this.formData.email);
      }
    }
  }


  /*
  async saveUser(): Promise<void> {
    if (!this.validateForm()) return;
    if (!this.availabilityCheck.available && this.modalType === 'create') {
      this.modalError = 'Username or email already exists';
      return;
    }

    this.modalLoading = true;
    this.modalError = '';

    try {
      if (this.modalType === 'create') {
        const registerData: RegisterRequest = {
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.newPassword,
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          role: this.formData.role,
          departementId: this.formData.departementId
        };

        this.authService.registerWithoutLogin(registerData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.closeModal();
              this.loadUsers();
            },
            error: (err) => {
              this.modalError = err.error?.message || 'Failed to create user';
              this.modalLoading = false;
            }
          });

      } else if (this.modalType === 'edit' && this.selectedUser) {
        const updateData: UpdateUserRequest = {
          username: this.formData.username,
          email: this.formData.email,
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          departementId: this.formData.departementId
        };

        this.authService.updateUser(this.selectedUser.id, updateData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              // Update role if changed
              if (this.formData.role !== this.selectedUser!.role) {
                const roleData: UpdateRoleRequest = {
                  role: this.formData.role,
                  departementId: this.formData.departementId
                };
                this.authService.updateUserRole(this.selectedUser!.id, roleData)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe({
                    next: () => {
                      this.closeModal();
                      this.loadUsers();
                    },
                    error: (err) => {
                      this.modalError = err.error?.message || 'Failed to update user role';
                      this.modalLoading = false;
                    }
                  });
              } else {
                this.closeModal();
                this.loadUsers();
              }
            },
            error: (err) => {
              this.modalError = err.error?.message || 'Failed to update user';
              this.modalLoading = false;
            }
          });

      } else if (this.modalType === 'password' && this.selectedUser) {
        const passwordData: ChangePasswordRequest = {
          currentPassword: this.formData.currentPassword || 'admin-reset',
          newPassword: this.formData.newPassword
        };

        this.authService.changePassword(this.selectedUser.id, passwordData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.closeModal();
              // No need to reload users for password change
            },
            error: (err) => {
              this.modalError = err.error?.message || 'Failed to reset password';
              this.modalLoading = false;
            }
          });
      }
    } catch (err: any) {
      this.modalError = err.error?.message || `Failed to ${this.modalType} user`;
      this.modalLoading = false;
    }
  }
*/
  /*
  async deleteUser(): Promise<void> {
    if (!this.selectedUser) return;

    this.modalLoading = true;
    this.modalError = '';

    this.authService.deleteUser(this.selectedUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          this.modalError = err.error?.message || 'Failed to delete user';
          this.modalLoading = false;
        }
      });
  }
*/
  // Utility functions
  getRoleName(role: UserRole): string {
    switch (role) {
      case UserRole.Doctor: return 'Doctor';
      case UserRole.Archivist: return 'Archivist';
      case UserRole.Admin: return 'Admin';
      default: return 'Unknown';
    }
  }

  getRoleColor(role: UserRole): string {
    switch (role) {
      case UserRole.Doctor: return 'role-doctor';
      case UserRole.Archivist: return 'role-archivist';
      case UserRole.Admin: return 'role-admin';
      default: return 'role-unknown';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStats(): UserStats {
    return {
      total: this.users.length,
      doctors: this.users.filter(u => u.role === UserRole.Doctor).length,
      archivists: this.users.filter(u => u.role === UserRole.Archivist).length,
      admins: this.users.filter(u => u.role === UserRole.Admin).length,
      active: this.users.length // Assuming all users are active
    };
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetPassword(user: UserDto): void {
    this.openModal('password', user);
  }





  // Ajoutez ces méthodes à votre AdminUserManagementComponent existant

  // TrackBy function pour améliorer les performances Angular
  trackByUserId(index: number, user: UserDto): number {
    return user.id;
  }

  // Validation améliorée pour les emails
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validation du mot de passe
  private isValidPassword(password: string): boolean {
    // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Validation améliorée du formulaire
  validateForm(): boolean {
    this.formErrors = {};

    // Validation des champs obligatoires
    if (!this.formData.firstName?.trim()) {
      this.formErrors['firstName'] = 'First name is required';
    } else if (this.formData.firstName.trim().length < 2) {
      this.formErrors['firstName'] = 'First name must be at least 2 characters';
    }

    if (!this.formData.lastName?.trim()) {
      this.formErrors['lastName'] = 'Last name is required';
    } else if (this.formData.lastName.trim().length < 2) {
      this.formErrors['lastName'] = 'Last name must be at least 2 characters';
    }

    if (!this.formData.username?.trim()) {
      this.formErrors['username'] = 'Username is required';
    } else if (this.formData.username.trim().length < 3) {
      this.formErrors['username'] = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(this.formData.username)) {
      this.formErrors['username'] = 'Username can only contain letters, numbers, dots, underscores and hyphens';
    }

    if (!this.formData.email?.trim()) {
      this.formErrors['email'] = 'Email is required';
    } else if (!this.isValidEmail(this.formData.email)) {
      this.formErrors['email'] = 'Please enter a valid email address';
    }

    // Validation du mot de passe
    if (this.modalType === 'create' || this.modalType === 'password') {
      if (!this.formData.newPassword) {
        this.formErrors['newPassword'] = 'Password is required';
      } else if (!this.isValidPassword(this.formData.newPassword)) {
        this.formErrors['newPassword'] = 'Password must be at least 8 characters with uppercase, lowercase and number';
      }

      if (this.formData.newPassword !== this.formData.confirmPassword) {
        this.formErrors['confirmPassword'] = 'Passwords do not match';
      }
    }

    // Validation du département pour les rôles qui en ont besoin
    if ((this.formData.role === UserRole.Doctor || this.formData.role === UserRole.Archivist) && !this.formData.departementId) {
      this.formErrors['departementId'] = 'Department is required for this role';
    }

    return Object.keys(this.formErrors).length === 0;
  }

  // Gestion des erreurs améliorée
  private handleApiError(error: any, defaultMessage: string): string {
    console.error('API Error:', error);

    if (error.error?.message) {
      return error.error.message;
    }

    if (error.status) {
      switch (error.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'You are not authorized to perform this action.';
        case 403:
          return 'Access forbidden. You don\'t have permission.';
        case 404:
          return 'User not found.';
        case 409:
          return 'User already exists with this username or email.';
        case 500:
          return 'Server error. Please try again later.';
        case 0:
          return 'Unable to connect to server. Please check your internet connection.';
        default:
          return defaultMessage;
      }
    }

    return defaultMessage;
  }

  // Debounce pour la recherche
  private searchDebounce: any;

  onSearchChange(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  // Méthode de tri avancée
  sortUsers(column: string, direction: 'asc' | 'desc' = 'asc'): void {
    this.filteredUsers.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (column) {
        case 'name':
          valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
          valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'username':
          valueA = a.username.toLowerCase();
          valueB = b.username.toLowerCase();
          break;
        case 'email':
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case 'role':
          valueA = a.role;
          valueB = b.role;
          break;
        case 'department':
          valueA = a.departementName || '';
          valueB = b.departementName || '';
          break;
        case 'created':
          valueA = new Date(a.lastLogin || 0);
          valueB = new Date(b.lastLogin || 0);
          break;
        default:
          return 0;
      }

      if (direction === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  get paginatedUsers(): UserDto[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  // Export des données
  exportUsers(format: 'csv' | 'excel' = 'csv'): void {
    const headers = ['First Name', 'Last Name', 'Username', 'Email', 'Role', 'Department', 'Created At'];
    const data = this.filteredUsers.map(user => [
      user.firstName,
      user.lastName,
      user.username,
      user.email,
      this.getRoleName(user.role),
      user.departementName || 'N/A',
      user.lastLogin ? String(user.lastLogin) : 'N/A'
    ]);
    if (format === 'csv') {
      this.downloadCSV(headers, data);
    }
  }

  private downloadCSV(headers: string[], data: string[][]): void {
    const csvContent = [headers, ...data]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `users_export_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Bulk actions
  selectedUserIds: Set<number> = new Set();
  selectAllUsers = false;

  toggleUserSelection(userId: number): void {
    if (this.selectedUserIds.has(userId)) {
      this.selectedUserIds.delete(userId);
    } else {
      this.selectedUserIds.add(userId);
    }
    this.updateSelectAllState();
  }

  toggleSelectAll(): void {
    if (this.selectAllUsers) {
      this.selectedUserIds.clear();
    } else {
      this.filteredUsers.forEach(user => this.selectedUserIds.add(user.id));
    }
    this.selectAllUsers = !this.selectAllUsers;
  }

  private updateSelectAllState(): void {
    this.selectAllUsers = this.filteredUsers.length > 0 &&
      this.filteredUsers.every(user => this.selectedUserIds.has(user.id));
  }

  bulkDeleteUsers(): void {
    if (this.selectedUserIds.size === 0) return;

    const confirmMessage = `Are you sure you want to delete ${this.selectedUserIds.size} users? This action cannot be undone.`;

    if (confirm(confirmMessage)) {
      this.actionLoading = true;
      const deletePromises = Array.from(this.selectedUserIds).map(userId =>
        this.authService.deleteUser(userId).toPromise()
      );

      Promise.all(deletePromises)
        .then(() => {
          this.selectedUserIds.clear();
          this.loadUsers();
          this.showNotification('Users deleted successfully', 'success');
        })
        .catch(error => {
          this.error = this.handleApiError(error, 'Failed to delete some users');
          this.showNotification(this.error, 'error');
        })
        .finally(() => {
          this.actionLoading = false;
        });
    }
  }

  // Système de notifications
  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    // Implémentation basique - vous pouvez intégrer une librairie de notifications comme ngx-toastr
    console.log(`${type.toUpperCase()}: ${message}`);

    // Exemple d'implémentation simple
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#FF9800' : '#2196F3'};
  `;

    document.body.appendChild(notification);

    // Animation d'apparition
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);

    // Suppression automatique
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  // Amélioration de la méthode saveUser avec gestion d'erreurs
  async saveUser(): Promise<void> {
    if (!this.validateForm()) {
      this.showNotification('Please fix the form errors before submitting', 'error');
      return;
    }

    if (!this.availabilityCheck.available && this.modalType === 'create') {
      this.modalError = 'Username or email already exists';
      return;
    }

    this.modalLoading = true;
    this.modalError = '';

    try {
      if (this.modalType === 'create') {
        const registerData: RegisterRequest = {
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.newPassword,
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          role: this.formData.role,
          departementId: this.formData.departementId
        };

        await this.authService.registerWithoutLogin(registerData).toPromise();
        this.showNotification('User created successfully', 'success');

      } else if (this.modalType === 'edit' && this.selectedUser) {
        const updateData: UpdateUserRequest = {
          username: this.formData.username,
          email: this.formData.email,
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          departementId: this.formData.departementId
        };

        await this.authService.updateUser(this.selectedUser.id, updateData).toPromise();

        // Update role if changed
        if (this.formData.role !== this.selectedUser.role) {
          const roleData: UpdateRoleRequest = {
            role: this.formData.role,
            departementId: this.formData.departementId
          };
          await this.authService.updateUserRole(this.selectedUser.id, roleData).toPromise();
        }

        this.showNotification('User updated successfully', 'success');

      } else if (this.modalType === 'password' && this.selectedUser) {
        const passwordData: ChangePasswordRequest = {
          currentPassword: this.formData.currentPassword || 'admin-reset',
          newPassword: this.formData.newPassword
        };

        await this.authService.changePassword(this.selectedUser.id, passwordData).toPromise();
        this.showNotification('Password reset successfully', 'success');
      }

      this.closeModal();
      this.loadUsers();

    } catch (error: any) {
      this.modalError = this.handleApiError(error, `Failed to ${this.modalType} user`);
      this.showNotification(this.modalError, 'error');
    } finally {
      this.modalLoading = false;
    }
  }

  // Amélioration de la méthode deleteUser
  async deleteUser(): Promise<void> {
    if (!this.selectedUser) return;

    this.modalLoading = true;
    this.modalError = '';

    try {
      await this.authService.deleteUser(this.selectedUser.id).toPromise();
      this.showNotification('User deleted successfully', 'success');
      this.closeModal();
      this.loadUsers();
    } catch (error: any) {
      this.modalError = this.handleApiError(error, 'Failed to delete user');
      this.showNotification(this.modalError, 'error');
    } finally {
      this.modalLoading = false;
    }
  }

  // Méthode pour réinitialiser les filtres
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRole = 'all';
    this.selectedDepartment = 'all';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Méthode pour obtenir les statistiques détaillées
  getDetailedStats(): UserStats {
    const stats = this.getStats();
    return {
      total: stats.total,
      doctors: stats.doctors,
      archivists: stats.archivists,
      admins: stats.admins,
      active: stats.active,
      byDepartment: this.getUsersByDepartmentStats(),
      recentlyCreated: this.getRecentlyCreatedCount(), // count of users that have logged in within the last 30 days
      //lastUpdated: this.getLastUpdated()
    };
  }

  private getUsersByDepartmentStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    this.users.forEach(user => {
      if (user.departementName) {
        const dept = user.departementName;
        stats[dept] = (stats[dept] || 0) + 1;
      }
    });
    return stats;
  }

  private getRecentlyCreatedCount(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.users.filter(user => {
      if (!user.lastLogin) return false;  // i am actually using the user model not the userDto and the user model has not creadetAt field so instead i am using the lastlogin field to check if the user is active
      return new Date(user.lastLogin) > thirtyDaysAgo;
    }).length;
  }

  /*
  private getLastUpdated(): Date | null {
    const dates = this.users
      .map(user => user.updatedAt || user.createdAt)
      .filter(date => date)
      .map(date => new Date(date!));

    return dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;
  }
*/
  navigateAndReload(route: string): void {
    this.router.navigate([route]);
  }


  /**
   * Retrieves all departments from the service
   */
  loadDepartments(): void {
    this.isLoadingDepartments = true;

    this.departementService.getAllDepartements().subscribe({
      next: (departments: Departement[]) => {
        this.departments = departments;
        this.isLoadingDepartments = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.isLoadingDepartments = false;
        // Handle error (show toast, set error message, etc.)
      }
    });
  }
}
// Interface étendue pour les statistiques
interface UserStats {
  total: number;
  doctors: number;
  archivists: number;
  admins: number;
  active: number;
  byDepartment?: { [key: string]: number };
  recentlyCreated?: number;
  lastUpdated?: Date | null;
}