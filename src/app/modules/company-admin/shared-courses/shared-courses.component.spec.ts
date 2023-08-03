import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCoursesComponent } from './shared-courses.component';

describe('SharedCoursesComponent', () => {
  let component: SharedCoursesComponent;
  let fixture: ComponentFixture<SharedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
