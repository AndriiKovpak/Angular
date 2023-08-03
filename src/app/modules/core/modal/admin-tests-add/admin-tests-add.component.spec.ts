import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestsAddComponent } from './admin-tests-add.component';

describe('AdminTestsAddComponent', () => {
  let component: AdminTestsAddComponent;
  let fixture: ComponentFixture<AdminTestsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTestsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTestsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
