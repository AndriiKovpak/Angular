import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAdminEmployeeComponent } from './company-admin-employee.component';

describe('CompanyAdminEmployeeComponent', () => {
  let component: CompanyAdminEmployeeComponent;
  let fixture: ComponentFixture<CompanyAdminEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyAdminEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAdminEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
