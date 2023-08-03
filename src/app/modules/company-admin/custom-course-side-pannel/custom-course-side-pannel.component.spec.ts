import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCourseSidePannelComponent } from './custom-course-side-pannel.component';

describe('CustomCourseSidePannelComponent', () => {
  let component: CustomCourseSidePannelComponent;
  let fixture: ComponentFixture<CustomCourseSidePannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCourseSidePannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCourseSidePannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
