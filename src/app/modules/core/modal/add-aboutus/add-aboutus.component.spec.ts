import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAboutusComponent } from './add-aboutus.component';

describe('AddAboutusComponent', () => {
  let component: AddAboutusComponent;
  let fixture: ComponentFixture<AddAboutusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAboutusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAboutusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
