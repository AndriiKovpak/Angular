import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTestQuestionsComponent } from './company-test-questions.component';

describe('CompanyTestQuestionsComponent', () => {
  let component: CompanyTestQuestionsComponent;
  let fixture: ComponentFixture<CompanyTestQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyTestQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTestQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
