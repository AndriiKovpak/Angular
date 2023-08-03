import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlogoComponent } from './addlogo.component';

describe('AddlogoComponent', () => {
  let component: AddlogoComponent;
  let fixture: ComponentFixture<AddlogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddlogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddlogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
