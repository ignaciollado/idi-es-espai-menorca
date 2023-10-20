import { ChangeDetectionStrategy, Component, ViewEncapsulation, Inject, TemplateRef, EventEmitter, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { colors } from '../utils/colors';
import { addDays, addHours, endOfDay, isSameDay, isSameMonth, setDay, startOfDay, subDays, subSeconds, } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-booking-calendar-child',
  templateUrl: './booking-calendar-child.component.html',
  styleUrls: ['./booking-calendar-child.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})

export class BookingCalendarChildComponent {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;

  minDate: Date;
  minDateTo: Date;
  maxDate: Date;
  fromDate: FormControl
  toDate: FormControl
  resourceToBook: UntypedFormControl 
  bookingForm: UntypedFormGroup
  modal: any;
  
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
      //alert (`vas a reservar la sala ${resource.split("#")[0]}, hay que cambiar el tipo de datepicker`)
    } else if (resource.split("#")[1] === 'pavillion') {
      //alert (`vas a reservar el pavellón ${resource.split("#")[0]}`)
    }
    
  }

  view: CalendarView = CalendarView.Month

  isDragable: boolean = false
  isbeforeStart: boolean = false
  isafterEnd: boolean = false
  CalendarView = CalendarView
  viewDate: Date = new Date()

  modalData?: {
    action: string;
    event: CalendarEvent;
  }
  
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  
events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'Reserva Pavellón A',
      color: colors.pavellonA,
      allDay: true,
      resizable: {
        beforeStart: this.isbeforeStart,
        afterEnd: this.isafterEnd,
      },
      draggable: this.isDragable,
    },
    {
      start: subDays(startOfDay(new Date()), 0),
      end: addDays(new Date(), 0),
      title: 'Reserva Pavellón B',
      color: colors.pavellonB,
      allDay: true,
      resizable: {
        beforeStart: this.isbeforeStart,
        afterEnd: this.isafterEnd,
      },
      draggable: this.isDragable,
    },
    {
      start: addHours(startOfDay(setDay(new Date(), 3)), 14),
      end: subSeconds(addHours(startOfDay(setDay(new Date(), 3)), 16), 1),
      title: 'Reserva Sala GROGA',
      color: colors.yellow,
      resizable: {
        beforeStart: this.isbeforeStart,
        afterEnd: this.isafterEnd,
      },
      draggable: this.isDragable,
    },
    {
      start: addHours(startOfDay(setDay(new Date(), 3)), 17),
      end: subSeconds(addHours(startOfDay(setDay(new Date(), 3)), 18), 1),
      title: 'Reserva sala BLAVA',
      color: colors.blue,
      resizable: {
        beforeStart: this.isbeforeStart,
        afterEnd: this.isafterEnd,
      },
      draggable: this.isDragable,
    },
    {
      start: addHours(startOfDay(setDay(new Date(), 3)), 10),
      end: subSeconds(addHours(startOfDay(setDay(new Date(), 3)), 11), 1),
      title: 'Reserva sala VERMELLA',
      color: colors.red,
      resizable: {
        beforeStart: this.isbeforeStart,
        afterEnd: this.isafterEnd,
      },
      draggable: this.isDragable,
    },
    {
      start: addHours(startOfDay(setDay(new Date(), 3)), 8),
      end: subSeconds(addHours(startOfDay(setDay(new Date(), 3)), 9), 1),
      title: 'Reserva sala BLANCA',
      color: colors.white,
      resizable: {
        beforeStart: this.isbeforeStart,
        afterEnd: this.isafterEnd,
      },
      draggable: this.isDragable,
    },
  ];

  /* events: CalendarEvent[] = [] */

  activeDayIsOpen: boolean = true;

  refresh = new Subject<void>();

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' }); 
  }

  validateEventTimesChanged = (
    { event, newStart, newEnd, allDay }: CalendarEventTimesChangedEvent,
    addCssClass = true
  ) => {
    if (event.allDay) {
      return true;
    }

    delete event.cssClass;
    // don't allow dragging or resizing events to different days
    const sameDay = isSameDay(newStart, newEnd);

    if (!sameDay) {
      return false;
    }

    // don't allow dragging events to the same times as other events
    const overlappingEvent = this.events.find((otherEvent) => {
      return (
        otherEvent !== event &&
        !otherEvent.allDay &&
        ((otherEvent.start < newStart && newStart < otherEvent.end) ||
          (otherEvent.start < newEnd && newStart < otherEvent.end))
      );
    });

    if (overlappingEvent) {
      if (addCssClass) {
        event.cssClass = 'invalid-position';
      } else {
        return false;
      }
    }

    return true;
  };

/*   addEvent(event:any): void {
    this.events = [
      ...this.events,
      {
        title: event,
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
    this.updateBooking.emit(this.events);
  } */

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onSubmit():void {
    let resourceColor: any
   
    if (this.resourceToBook.value.split("#")[1] === 'room') {

      resourceColor = "colors."+ this.resourceToBook.value.split("#")[0]
      //alert (`vas a reservar la sala ${resource.split("#")[0]}, hay que cambiar el tipo de datepicker`)

    } else if (this.resourceToBook.value === 'pavillion') {
      //alert (`vas a reservar el pavellón ${resource.split("#")[0]}`)
    }
    console.log (this.resourceToBook.value, this.resourceToBook.value.split("#")[1], this.resourceToBook.value.split("#")[0], resourceColor)
    this.events = [
      ...this.events,
      {
        title: this.resourceToBook.value+"...PENDING",
        start: startOfDay(this.fromDate.value),
        end: endOfDay(this.toDate.value),
        color: colors.grey,
        draggable: this.isDragable,
        resizable: {
          beforeStart: this.isDragable,
          afterEnd: this.isafterEnd,
        },
      },
    ];
  }

  weekEndFilter: (date: Date | null) => boolean =
  (date: Date | null) => {
    const day = date?.getDay();
    return day !== 0 && day !== 6;
    //0 means sunday
    //6 means saturday
}
}

