import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHistoryListComponent } from './user-history-list.component';

describe('UserHistoryListComponent', () => {
  let component: UserHistoryListComponent;
  let fixture: ComponentFixture<UserHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserHistoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
