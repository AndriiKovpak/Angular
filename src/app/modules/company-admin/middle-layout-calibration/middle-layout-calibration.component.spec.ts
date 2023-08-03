import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddleLayoutCalibrationComponent } from './middle-layout-calibration.component';

describe('MiddleLayoutCalibrationComponent', () => {
  let component: MiddleLayoutCalibrationComponent;
  let fixture: ComponentFixture<MiddleLayoutCalibrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiddleLayoutCalibrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiddleLayoutCalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
