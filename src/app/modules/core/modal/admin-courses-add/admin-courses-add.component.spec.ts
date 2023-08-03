import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCoursesAddComponent } from './admin-courses-add.component';

describe('AdminCoursesAddComponent', () => {
  let component: AdminCoursesAddComponent;
  let fixture: ComponentFixture<AdminCoursesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCoursesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCoursesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
