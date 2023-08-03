import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ELearningHeadingComponent } from './e-learning-heading.component';

describe('ELearningHeadingComponent', () => {
  let component: ELearningHeadingComponent;
  let fixture: ComponentFixture<ELearningHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ELearningHeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ELearningHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
