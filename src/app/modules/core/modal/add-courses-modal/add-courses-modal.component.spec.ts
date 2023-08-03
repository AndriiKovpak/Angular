import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoursesMOdalComponent } from './add-courses-modal.component';

describe('AddCoursesMOdalComponent', () => {
  let component: AddCoursesMOdalComponent;
  let fixture: ComponentFixture<AddCoursesMOdalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCoursesMOdalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCoursesMOdalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
