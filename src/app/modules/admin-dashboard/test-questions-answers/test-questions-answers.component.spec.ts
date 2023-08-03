import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestQuestionsAnswersComponent } from './test-questions-answers.component';

describe('TestQuestionsAnswersComponent', () => {
  let component: TestQuestionsAnswersComponent;
  let fixture: ComponentFixture<TestQuestionsAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestQuestionsAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestQuestionsAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
