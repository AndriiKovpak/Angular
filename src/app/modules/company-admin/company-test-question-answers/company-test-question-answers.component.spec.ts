import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTestQuestionAnswersComponent } from './company-test-question-answers.component';

describe('CompanyTestQuestionAnswersComponent', () => {
  let component: CompanyTestQuestionAnswersComponent;
  let fixture: ComponentFixture<CompanyTestQuestionAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyTestQuestionAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTestQuestionAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
