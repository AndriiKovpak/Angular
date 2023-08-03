import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddleLayoutComponent } from './middle-layout.component';

describe('MiddleLayoutComponent', () => {
  let component: MiddleLayoutComponent;
  let fixture: ComponentFixture<MiddleLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiddleLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiddleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
