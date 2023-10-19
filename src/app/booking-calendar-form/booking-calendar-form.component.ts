import { Component, Inject, Output, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-booking-calendar-form',
  templateUrl: './booking-calendar-form.component.html',
  styleUrls: ['./booking-calendar-form.component.scss']
})

export class BookingCalendarFormComponent {
  minDate: Date;
  minDateTo: Date;
  maxDate: Date;
  fromDate: FormControl
  toDate: FormControl
  resourceToBook: UntypedFormControl 
  bookingForm: UntypedFormGroup

  constructor(
    private formBuilder: UntypedFormBuilder,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,

    ) {

    this._locale = 'ca-ES'; /* 'es-ES' */
    this._adapter.setLocale(this._locale)

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDay = new Date().getDate()

    this.minDate = new Date(currentYear, currentMonth, currentDay)
    this.minDateTo = this.minDate 
    this.maxDate = new Date(currentYear + 1, 11, 31)

    this.fromDate = new FormControl<Date | null>(null, [ Validators.required ])
    this.toDate = new FormControl<Date | null>(null, [ Validators.required])
    this.resourceToBook = new UntypedFormControl('', [ Validators.required ])

    this.bookingForm = this.formBuilder.group ({
      resourceToBook: this.resourceToBook,
      fromDate: this.fromDate,
      toDate: this.toDate,
    })

    this.bookingForm.valueChanges.subscribe((e) => {
      console.log (e)
    
      const currentYearTo = new Date(e.fromDate).getFullYear()
      const currentMonthTo = new Date(e.fromDate).getMonth()
      const currentDayTo = new Date(e.fromDate).getDate()
  
      this.minDateTo = new Date(currentYearTo, currentMonthTo, currentDayTo)
      this.resourceSelected(e.resourceToBook);
    });

  }

  public resourceSelected( resource: string ) {

    if (resource.split("#")[1] === 'room') {
      alert (`vas a reservar la sala ${resource.split("#")[0]}, hay que cambiar el tipo de datepicker`)
    } else if (resource.split("#")[1] === 'pavillion') {
      alert (`vas a reservar el pavellón ${resource.split("#")[0]}`)
    }
    
  }

  onSubmit(bookingForm: FormGroup) {
    console.log (this.resourceToBook.value, this.fromDate.value, this.toDate.value)
  }

  weekEndFilter: (date: Date | null) => boolean =
    (date: Date | null) => {
      const day = date?.getDay();
      return day !== 0 && day !== 6;
      //0 means sunday
      //6 means saturday
  }

  dateClass = (d: Date | null) => {
    const date = d?.getDay();
    // Highlight saturday and sunday.
    return (date === 0 || date === 6) ? 'highlight-dates' : undefined;
  }
}
