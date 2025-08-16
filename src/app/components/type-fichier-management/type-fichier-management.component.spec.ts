import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFichierManagementComponent } from './type-fichier-management.component';

describe('TypeFichierManagementComponent', () => {
  let component: TypeFichierManagementComponent;
  let fixture: ComponentFixture<TypeFichierManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeFichierManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeFichierManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
