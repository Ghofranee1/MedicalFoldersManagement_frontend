import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Added RouterModule
import { AuthService } from '../../../services/auth.service';
import { DepartementService } from '../../../services/departement.service';
import { RegisterRequest, UserRole } from '../../../models/auth.model';
import { Departement } from '../../../models/departement.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule] // Added RouterModule
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;
  departements: Departement[] = [];
  
  userRoles = [
    { value: UserRole.Doctor, label: 'Doctor', description: 'Can view all patient files and folders' },
    { value: UserRole.Archivist, label: 'Archivist', description: 'Can manage files in assigned department' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private departementService: DepartementService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      role: [UserRole.Doctor, [Validators.required]],
      departementId: [null]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Redirect to dashboard if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadDepartements();
    this.setupRoleChangeListener();
  }

  private loadDepartements(): void {
    /*
    this.departementService.getAllDepartements().subscribe({
      next: (response) => {
        this.departements = response.map((dept: any) => ({
          id: dept.id,
          libelleFr: dept.libelleFr ?? '',
          libelleAr: dept.libelleAr,
          abreviationFr: dept.abreviationFr,
          abreviationAr: dept.abreviationAr,
          reference: dept.reference,
          status: dept.status,
          dossiers: dept.dossiers
        }));
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
    */
    this.departementService.getAllDepartements().subscribe({
      next: (response) => {
        this.departements = (response as any[]).map((dept: any) => ({
          id: dept.id,
          libelleFr: dept.libelleFr ?? '',
          libelleAr: dept.libelleAr,
          abreviationFr: dept.abreviationFr,
          abreviationAr: dept.abreviationAr,
          reference: dept.reference,
          status: dept.status,
          dossiers: dept.dossiers
        }));
      },
      error: (error) => {
        console.error('Error loading departements:', error);
      }
    });
  }

  private setupRoleChangeListener(): void {
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      const departementControl = this.registerForm.get('departementId');
      
      if (role === UserRole.Archivist) {
        departementControl?.setValidators([Validators.required]);
      } else {
        departementControl?.clearValidators();
        departementControl?.setValue(null);
      }
      
      departementControl?.updateValueAndValidity();
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';

    const formValue = this.registerForm.value;
    const registerRequest: RegisterRequest = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      role: formValue.role,
      departementId: formValue.role === UserRole.Archivist ? formValue.departementId : undefined
    };

    
    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.message || 'Registration failed. Please try again.';
      }
    });
    
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get role() { return this.registerForm.get('role'); }
  get departementId() { return this.registerForm.get('departementId'); }
  
  get isArchivistRole(): boolean {
    return this.role?.value === UserRole.Archivist;
  }
}