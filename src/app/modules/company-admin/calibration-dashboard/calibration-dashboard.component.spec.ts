import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalibrationDashboardComponent } from './calibration-dashboard.component';

describe('CalibrationDashboardComponent', () => {
  let component: CalibrationDashboardComponent;
  let fixture: ComponentFixture<CalibrationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalibrationDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalibrationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
