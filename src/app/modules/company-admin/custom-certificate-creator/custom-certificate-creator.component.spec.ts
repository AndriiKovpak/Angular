import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCertificateCreatorComponent } from './custom-certificate-creator.component';

describe('CustomCertificateCreatorComponent', () => {
  let component: CustomCertificateCreatorComponent;
  let fixture: ComponentFixture<CustomCertificateCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCertificateCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCertificateCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
