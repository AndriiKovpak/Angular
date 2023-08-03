import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminControlModalComponent } from './admin-control-modal.component';

describe('AdminControlModalComponent', () => {
  let component: AdminControlModalComponent;
  let fixture: ComponentFixture<AdminControlModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminControlModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminControlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
