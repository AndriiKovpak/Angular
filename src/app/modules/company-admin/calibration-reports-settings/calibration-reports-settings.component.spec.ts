import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalibrationReportsSettingsComponent } from './calibration-reports-settings.component';

describe('CalibrationReportsSettingsComponent', () => {
  let component: CalibrationReportsSettingsComponent;
  let fixture: ComponentFixture<CalibrationReportsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalibrationReportsSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalibrationReportsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
