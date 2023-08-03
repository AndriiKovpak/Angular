import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompaniesAddComponent } from './admin-companies-add.component';

describe('AdminCompaniesAddComponent', () => {
  let component: AdminCompaniesAddComponent;
  let fixture: ComponentFixture<AdminCompaniesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCompaniesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCompaniesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
