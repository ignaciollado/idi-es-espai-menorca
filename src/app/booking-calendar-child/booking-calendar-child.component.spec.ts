import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCalendarChildComponent } from './booking-calendar-child.component';

describe('BookingCalendarChildComponent', () => {
  let component: BookingCalendarChildComponent;
  let fixture: ComponentFixture<BookingCalendarChildComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingCalendarChildComponent]
    });
    fixture = TestBed.createComponent(BookingCalendarChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
