import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAddCredentialsComponent } from './employee-add-credentials.component';

describe('EmployeeAddCredentialsComponent', () => {
  let component: EmployeeAddCredentialsComponent;
  let fixture: ComponentFixture<EmployeeAddCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAddCredentialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAddCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
