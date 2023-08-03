import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestTreeComponent } from './admin-test-tree.component';

describe('AdminTestTreeComponent', () => {
  let component: AdminTestTreeComponent;
  let fixture: ComponentFixture<AdminTestTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTestTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTestTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
