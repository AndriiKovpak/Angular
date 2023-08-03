import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeRecordsComponent } from './gauge-records.component';

describe('GaugeRecordsComponent', () => {
  let component: GaugeRecordsComponent;
  let fixture: ComponentFixture<GaugeRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GaugeRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
