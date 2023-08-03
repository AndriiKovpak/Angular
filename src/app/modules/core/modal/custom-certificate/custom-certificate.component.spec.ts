import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCertificateComponent } from './custom-certificate.component';

describe('CustomCertificateComponent', () => {
  let component: CustomCertificateComponent;
  let fixture: ComponentFixture<CustomCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
