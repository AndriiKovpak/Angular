import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cellRenderer.Component.TsComponent } from './cell-renderer.component.ts.component';

describe('cellRenderer.Component.TsComponent', () => {
  let component: cellRenderer.Component.TsComponent;
  let fixture: ComponentFixture<cellRenderer.Component.TsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ cellRenderer.Component.TsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(cellRenderer.Component.TsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
