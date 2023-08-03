import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartSeconedComponent } from './shopping-cart-seconed.component';

describe('ShoppingCartSeconedComponent', () => {
  let component: ShoppingCartSeconedComponent;
  let fixture: ComponentFixture<ShoppingCartSeconedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingCartSeconedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartSeconedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
