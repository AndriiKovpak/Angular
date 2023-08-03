import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridCellDashboardComponent } from './ag-grid-cell-dashboard.component';

describe('AgGridCellDashboardComponent', () => {
  let component: AgGridCellDashboardComponent;
  let fixture: ComponentFixture<AgGridCellDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgGridCellDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridCellDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
