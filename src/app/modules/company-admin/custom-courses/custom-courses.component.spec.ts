import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCoursesComponent } from './custom-courses.component';

describe('CustomCoursesComponent', () => {
  let component: CustomCoursesComponent;
  let fixture: ComponentFixture<CustomCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
