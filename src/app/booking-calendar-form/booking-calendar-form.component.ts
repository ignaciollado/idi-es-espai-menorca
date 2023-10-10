import { Component, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking-calendar-form',
  templateUrl: './booking-calendar-form.component.html',
  styleUrls: ['./booking-calendar-form.component.scss']
})
export class BookingCalendarFormComponent {
  minDate: Date;
  maxDate: Date;
  fromDate: FormControl
  toDate: FormControl
  resourceToBook: UntypedFormControl
  bookingForm: UntypedFormGroup

  constructor(private formBuilder: UntypedFormBuilder,) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);

    this.fromDate = new FormControl<Date | null>(null, [ Validators.required ])
    this.toDate = new FormControl<Date | null>(null, [ Validators.required])
    this.resourceToBook = new UntypedFormControl('', [ Validators.required ])

    this.bookingForm = this.formBuilder.group ({
      resourceToBook: this.resourceToBook,
      fromDate: this.fromDate,
      toDate: this.toDate,
    })
  }
  
  onSubmit(bookingForm: FormGroup) {
    console.log (this.resourceToBook.value, this.fromDate.value, this.toDate.value)
  }
}
