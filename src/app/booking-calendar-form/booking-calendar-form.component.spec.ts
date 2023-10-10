import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCalendarFormComponent } from './booking-calendar-form.component';

describe('BookingCalendarFormComponent', () => {
  let component: BookingCalendarFormComponent;
  let fixture: ComponentFixture<BookingCalendarFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingCalendarFormComponent]
    });
    fixture = TestBed.createComponent(BookingCalendarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
