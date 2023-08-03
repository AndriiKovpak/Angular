import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEyeComponent } from './course-eye.component';

describe('CourseEyeComponent', () => {
  let component: CourseEyeComponent;
  let fixture: ComponentFixture<CourseEyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseEyeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseEyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
