import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCalibrationComponent } from './admin-calibration.component';

describe('AdminCalibrationComponent', () => {
  let component: AdminCalibrationComponent;
  let fixture: ComponentFixture<AdminCalibrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCalibrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
