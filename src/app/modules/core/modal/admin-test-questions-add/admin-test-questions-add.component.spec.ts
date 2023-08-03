import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestQuestionsAddComponent } from './admin-test-questions-add.component';

describe('AdminTestQuestionsAddComponent', () => {
  let component: AdminTestQuestionsAddComponent;
  let fixture: ComponentFixture<AdminTestQuestionsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTestQuestionsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTestQuestionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
