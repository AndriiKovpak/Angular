import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordTypeFilterComponent } from './record-type-filter.component';

describe('RecordTypeFilterComponent', () => {
  let component: RecordTypeFilterComponent;
  let fixture: ComponentFixture<RecordTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordTypeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
