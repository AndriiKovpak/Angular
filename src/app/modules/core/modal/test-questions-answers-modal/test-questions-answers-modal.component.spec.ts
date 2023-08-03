import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestQuestionsAnswersModalComponent } from './test-questions-answers-modal.component';

describe('TestQuestionsAnswersModalComponent', () => {
  let component: TestQuestionsAnswersModalComponent;
  let fixture: ComponentFixture<TestQuestionsAnswersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestQuestionsAnswersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestQuestionsAnswersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
