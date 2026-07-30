import { booleanAttribute, Component, ViewEncapsulation } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { FormGroup, FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent, CalendarView, CalendarWeekViewBeforeRenderEvent, DAYS_OF_WEEK } from 'angular-calendar';
import { colors } from '../utils/colors';
import { addDays, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { ThemePalette } from '@angular/material/core';
import { BookingDTO, BookingADRBalearsDTO } from '../Models/booking.model';
import { BookingService } from '../Services/booking.service';
import { SharedService } from '../Services/shared.service';
import { EmailManagementService } from '../Services/emailManagement.service';
import { EventColor } from 'calendar-utils';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import localeCA from '@angular/common/locales/ca';
import { MatSnackBar } from '@angular/material/snack-bar';

if (localStorage.getItem('preferredLang') === 'es') {
  registerLocaleData(localeES);
} else  {
  registerLocaleData(localeCA);
}

@Component({
  selector: 'app-booking-calendar-child',
  templateUrl: './booking-calendar-child.component.html',
  styleUrls: ['./booking-calendar-child.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class BookingCalendarChildComponent {
  isTarifaVisible: boolean = false
  isFeedBackVisible: boolean = false
  public minDate: Date
  public minDateTo: Date
  public maxDate: Date
  public fromMountingDate: FormControl
  public toMountingDate: FormControl
  public fromDate: FormControl
  public fromDateFromTime!: FormControl
  public toDate: FormControl
  public toDateToTime!: FormControl
  public bki_id: UntypedFormControl
  public title: UntypedFormControl
  public usucre: UntypedFormControl
  public proID: UntypedFormControl
  public bkr_id: UntypedFormControl
  public name: UntypedFormControl
  public cif: UntypedFormControl
  public email: UntypedFormControl
  public bookingForm: UntypedFormGroup
  public acceptTerms: FormControl<any>
  public modal: any;
  public theBooking: BookingDTO
  public bookings: BookingDTO[] = []
  public bookingsADRBalears: BookingADRBalearsDTO[] = []

  currentLang: string = ""
  fullYearFrom: number

  public disabled = false
  public showSpinners = true
  public showSeconds = false
  public stepMinute = 1
  public stepSecond = 1
  public enableMeridian = false
  public touchUi = false
  public disableMinute = false
  public showTime = false
  public color: ThemePalette = 'primary'

  public boo_company: FormGroup

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  view: CalendarView = CalendarView.Month

  locale: string = 'ca'

  isDragable: boolean = false
  isbeforeStart: boolean = false
  isafterEnd: boolean = false
  CalendarView = CalendarView
  viewDate: Date = new Date()

  modalData?: {
    action: string;
    event: CalendarEvent;
  }

  month(event: CalendarEvent): string {
    return `Custom prefix: ${event.title}`;
  }

  /* events: CalendarEvent[] = [] */

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
 
  events: CalendarEvent[] = [ ];

  fullMonthFrom: number;
  fullDayFrom: number;

  constructor (
    private formBuilder: UntypedFormBuilder,
    private bookingService: BookingService,
    private sharedService: SharedService,
    private dateAdapter: DateAdapter<Date>,
    private emailManagementService: EmailManagementService,
    private snackBar: MatSnackBar,
    ) {
    this.dateAdapter.getFirstDayOfWeek = () => 1
    this.dateAdapter.setLocale = () => 'es'
    this.theBooking = new BookingDTO ('', '', 0, '', '', '', '', '', '', '', true);
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDay = new Date().getDate() + 5 /* Reservas con una antelación de 5 días */

    this.minDate = new Date(currentYear, currentMonth, currentDay)
    this.maxDate = new Date(currentYear, currentMonth+36, currentDay) /*  14/04/2025 lo cambio a 36 meses para quitar el límite a petición de Silvia y Tete */
    //this.maxDate = new Date(currentYear, currentMonth+6, currentDay) /* Reserva máximo hasta seis meses (de 180 días) */
    this.minDateTo = this.minDate
    /* this.maxDate = new Date(currentYear + 1, 11, 31) */

    this.title = new UntypedFormControl('', [Validators.required])
    this.usucre = new UntypedFormControl('ADRWeb')
    this.proID = new UntypedFormControl('42')
    this.bki_id = new UntypedFormControl('', [ Validators.required ])
    this.bkr_id = new UntypedFormControl('', [Validators.required])
    this.boo_company = new FormGroup({
      name: new UntypedFormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(60) ]),
      cif: new UntypedFormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      contact: new UntypedFormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      email: new UntypedFormControl('', [ Validators.required, Validators.email ])
    })
    this.fromMountingDate = new FormControl<Date | null>(null, Validators.required)
    this.toMountingDate = new FormControl<Date | null>(null, Validators.required)

    this.fromDate = new FormControl<Date | null>(null, [ Validators.required ])
    this.fromDateFromTime = new FormControl('')
    this.toDate = new FormControl<Date | null>(null, [ Validators.required])
    this.toDateToTime = new FormControl('')
    this.acceptTerms = new FormControl(false, [Validators.requiredTrue])

    this.bookingForm = this.formBuilder.group ({
      usucre: this.usucre,
      pro_id: this.proID,
      bki_id: this.bki_id,
      bkr_id: this.bkr_id,
      boo_company: this.boo_company,
      boo_start: this.fromDate,
      fromDateFromTime : this.fromDateFromTime,
      boo_end: this.toDate,
      toDateToTime: this.toDateToTime,
      boo_title: this.title,
      acceptTerms: this.acceptTerms,
    })

    this.bookingForm.valueChanges.subscribe((e) => {
     this.minDateTo = e.boo_start
     /*  if (e.bki_id) {
        this.resourceSelected(e.bki_id)
      } */
    });
  }

  ngOnInit() {
   this.currentLang = localStorage.getItem('preferredLang')
   this.loadBookingListADRBalears()
  }

  private loadBookingListADRBalears() {
    let eventItem: CalendarEvent
    let myColor: EventColor
    let myTitle: string = ""
    let bookingState: string = ""
    this.events = []
    this.bookingService.getAllBookingsADRBalears()
        .subscribe(
          (bookingADRBalears:BookingADRBalearsDTO[]) => {
            this.bookingsADRBalears = bookingADRBalears
            if (this.bookingsADRBalears) {
              const typeArr: BookingADRBalearsDTO[] = Object
                .entries(this.bookingsADRBalears).map(([key, value]) => value)
                for(var index in typeArr[0])
                {
                  switch  (typeArr[0][index].booking_status) {
                    case 1:
                      bookingState = "Reserva pendiente"
                      break
                    case 2:
                      bookingState = "Validado"
                      break
                    default:
                      bookingState = "No lo sé " + typeArr[0][index].booking_status
                  }

                  const startTime: Date = new Date(typeArr[0][index].bkd_start);
                  const starthours: string = startTime.getHours().toString().padStart(2, '0');
                  const startminutes: string = startTime.getMinutes().toString().padStart(2, '0');
                  const startseconds: string = startTime.getSeconds().toString().padStart(2, '0');
                  const startTimeFormated: string = starthours+":"+startminutes+":"+startseconds

                  const endTime: Date = new Date(typeArr[0][index].bkd_end);
                  const endhours: string = endTime.getHours().toString().padStart(2, '0');
                  const endminutes: string = endTime.getMinutes().toString().padStart(2, '0');
                  const endseconds: string = endTime.getSeconds().toString().padStart(2, '0');
                  const endTimeFormated: string = endhours+":"+endminutes+":"+endseconds

                  switch(typeArr[0][index].bki_id) {
                    case 2: /* SALA TORONJA PERO NO EXISTE EN PRODUCCIÓN */
                      if (typeArr[0][index].booking_status === 1) {
                        myColor = colors.grey
                      } else {
                        myColor = colors.pavellonA
                      }
                      myTitle = "<ul><li><u><b>" + typeArr[0][index].boo_title + "</b></u></li><li>Sala toronja</li><li>Reserva desde el "  + new Date(typeArr[0][index].bkd_start).toLocaleDateString() + " hasta el " + new Date(typeArr[0][index].bkd_end).toLocaleDateString() + "</li><li>Estado: " + bookingState + "</li></ul>"
                      eventItem = {
                        title:  myTitle,
                        color:  myColor,
                        start:  subDays(startOfDay(new Date(typeArr[0][index].bkd_start)), 0),
                        end:    addDays(new Date(typeArr[0][index].bkd_end), 0),
                        meta: {
                          type: 'info'
                        },
                        allDay: false,
                        cssClass: 'event-class',
                        resizable: {
                          beforeStart: this.isbeforeStart,
                          afterEnd: this.isafterEnd,
                        },
                        draggable: this.isDragable,
                      }
                      break
                    case 3: /* SALA BLANCA */
                      if (typeArr[0][index].booking_status === 1) {
                        myColor = colors.grey
                      } else {
                        myColor = colors.white
                      }
                      myTitle = "<ul><li><u><b>" + typeArr[0][index].boo_title + "</b></u></li><li>Sala blanca</li><li>Reserva desde el "  + new Date(typeArr[0][index].bkd_start).toLocaleDateString() + " hasta el " + new Date(typeArr[0][index].bkd_end).toLocaleDateString() + "</li><li>Horario: De "+startTimeFormated+" a "+endTimeFormated+"</li><li>Estado: " + bookingState + "</li></ul>"
                      eventItem = {
                        title:  myTitle,
                        color:  myColor,
                        start:  subDays(startOfDay(new Date(typeArr[0][index].bkd_start)), 0),
                        end:    addDays(new Date(typeArr[0][index].bkd_end), 0),
                        meta: {
                          type: 'info'
                        },
                        allDay: false,
                        cssClass: 'event-class',
                        resizable: {
                          beforeStart: this.isbeforeStart,
                          afterEnd: this.isafterEnd,
                        },
                        draggable: this.isDragable,
                      }                                               
                      break
                    case 4: /* SALA BLAVA */
                      if (typeArr[0][index].booking_status === 1) {
                        myColor = colors.grey
                      } else {
                        myColor = colors.blue
                      }
                      myTitle = "<ul><li><u><b>" + typeArr[0][index].boo_title + "</b></u></li><li>Sala Blava</li><li>Reserva desde el "  + new Date(typeArr[0][index].bkd_start).toLocaleDateString() + " hasta el " + new Date(typeArr[0][index].bkd_end).toLocaleDateString() + "</li><li>Horario: De "+startTimeFormated+" a "+endTimeFormated+"</li><li>Estado: " + bookingState + "</li></ul>"
                      eventItem = {
                        title:  myTitle,
                        color:  myColor,
                        start:  subDays(startOfDay(new Date(typeArr[0][index].bkd_start)), 0),
                        end:    addDays(new Date(typeArr[0][index].bkd_end), 0),
                        meta: {
                          type: 'info'
                        },
                        allDay: false,
                        cssClass: 'event-class',
                        resizable: {
                          beforeStart: this.isbeforeStart,
                          afterEnd: this.isafterEnd,
                        },
                        draggable: this.isDragable,
                      }                                        
                      break
                    case 5: /* SALA GROGA */
                      if (typeArr[0][index].booking_status === 1) {
                        myColor = colors.grey
                      } else {
                        myColor = colors.yellow
                      }
                      myTitle = "<ul><li><u><b>" + typeArr[0][index].boo_title + "</b></u></li><li>Sala Groga</li><li>Reserva desde el "  + new Date(typeArr[0][index].bkd_start).toLocaleDateString() + " hasta el " + new Date(typeArr[0][index].bkd_end).toLocaleDateString() + "</li><li>Horario: De "+startTimeFormated+" a "+endTimeFormated+"</li><li>Estado: " + bookingState + "</li></ul>"
                      eventItem = {
                        title:  myTitle,
                        color:  myColor,
                        start:  subDays(startOfDay(new Date(typeArr[0][index].bkd_start)), 0),
                        end:    addDays(new Date(typeArr[0][index].bkd_end), 0),
                        meta: {
                          type: 'info'
                        },
                        allDay: false,
                        cssClass: 'event-class',
                        resizable: {
                          beforeStart: this.isbeforeStart,
                          afterEnd: this.isafterEnd,
                        },
                        draggable: this.isDragable,
                      }                      
                      break
                    case 6: /* SALA VERMELLA */
                      if (typeArr[0][index].booking_status === 1) {
                        myColor = colors.grey
                      } else {
                        myColor = colors.red
                      }
                      myTitle = "<ul><li><u><b>" + typeArr[0][index].boo_title + "</b></u></li><li>Sala Vermella</li><li>Reserva desde el "  + new Date(typeArr[0][index].bkd_start).toLocaleDateString() + " hasta el " + new Date(typeArr[0][index].bkd_end).toLocaleDateString() + "</li><li>Horario: De "+startTimeFormated+" a "+endTimeFormated+"</li><li>Estado: " + bookingState + "</li></ul>"
                      eventItem = {
                        title:  myTitle,
                        color:  myColor,
                        start:  subDays(startOfDay(new Date(typeArr[0][index].bkd_start)), 0),
                        end:    addDays(new Date(typeArr[0][index].bkd_end), 0),
                        meta: {
                          type: 'info'
                        },
                        allDay: false,
                        cssClass: 'event-class',
                        resizable: {
                          beforeStart: this.isbeforeStart,
                          afterEnd: this.isafterEnd,
                        },
                        draggable: this.isDragable,
                      }                      
                      break
                    case 7: /* PAVELLÓN A */
                      if (typeArr[0][index].booking_status === 1) {
                        myColor = colors.grey
                      } else {
                        myColor = colors.pavellonA
                      }
                      myTitle = "<ul><li><u><b>" + typeArr[0][index].boo_title + "</b></u></li><li>Pavelló Exposició A</li><li>Reserva desde el "  + new Date(typeArr[0][index].bkd_start).toLocaleDateString() + " hasta el " + new Date(typeArr[0][index].bkd_end).toLocaleDateString() + "</li><li>Estado: " + bookingState + "</li></ul>"
                      eventItem = {
                        title:  myTitle,
                        color:  myColor,
                        start:  subDays(startOfDay(new Date(typeArr[0][index].bkd_start)), 0),
                        end:    addDays(new Date(typeArr[0][index].bkd_end), 0),
                        meta: {
                          type: 'info'
                        },
                        allDay: false,
                        cssClass: 'event-class',
                        resizable: {
                          beforeStart: this.isbeforeStart,
                          afterEnd: this.isafterEnd,
                        },
                        draggable: this.isDragable,
                      }
                      break
                    default:
                      console.log (`${typeArr[0][index].bki_id} no sé que recurso es`)
                  }
                  this.events.push(eventItem)
                  this.refresh.next() /* Para que en la primera carga del calendario pinte los eventos que hay en la bbdd */
                }
            }
          })
  }
  
  public resourceSelected( resource: string ) {

  }

  /* events: CalendarEvent[] = [] */

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    return
    renderEvent.body.forEach((day) => {
      const dayOfMonth = day.date.getDate();
      
      if (dayOfMonth > 5 && dayOfMonth < 10 && day.inMonth) {
        day.cssClass = 'bg-pink';
      }
    });
  }

  activeDayIsOpen: boolean = true;

  refresh = new Subject<void>();

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0 ) {
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
    this.modalData = { event, action }
    document.getElementById("resourceDetail")?.classList.remove("ocultar")
    document.getElementById("resourceDetail")!.innerHTML = "--"+event.title+"--"
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    renderEvent.hourColumns.forEach((hourColumn) => {
      hourColumn.hours.forEach((hour) => {
        hour.segments.forEach((segment) => {
          if (segment.date.getHours() > 2) {
            segment.cssClass = "bg-pink"
          }
        })
      })
    })
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

/*   onSubmit():void {
    let resourceColor: any
    let errorResponse: any
    let responseOK: boolean = false
    let locator: string = ""

    this.bookingService.sendPostRequest(this.bookingForm.value)
    .subscribe((insertResponse: any) => {
    console.log('Reserva creada:', insertResponse); // <-- aquí tienes la respuesta
    
     if (insertResponse.status === 'failure') {
      responseOK = false
      this.sharedService.managementToast('postFeedback', responseOK, insertResponse, 'booking')
     } else {
      responseOK = true
      console.log("Reserva ok", insertResponse)
      locator = insertResponse.locator
      this.sharedService.managementToast('postFeedback', responseOK, insertResponse, 'booking')
      this.emailManagementService.sendCustomerEmail(this.bookingForm, locator)
      .subscribe((emailsent:any) => {
        console.log ("email enviado: ", emailsent)
      })
     }

    }, error => { 
      responseOK = false
      this.sharedService.managementToast('postFeedback', responseOK, error.message)
      })
  } */

  onSubmit(): void {
    this.bookingService.sendPostRequest(this.bookingForm.value)
      .subscribe({
        next: (insertResponse: any) => {
          if (insertResponse?.status === 'failure') {
            this.snackBar.open(
              insertResponse.message,
              'Cerrar',
              { duration: 12000 }
            );
            return;
          }

          this.snackBar.open(
            'Reserva realizada correctamente',
            'Cerrar',
            { duration: 12000 }
          );

          this.emailManagementService
            .sendCustomerEmail(this.bookingForm, '')
            .subscribe();
        },

        error: (error) => {

          this.snackBar.open(
            'Error al realizar la reserva',
            'Cerrar',
            { duration: 12000 }
          );
        }
      });
  }

  weekEndFilter: (date: Date | null) => boolean =
    (date: Date | null) => {
    const day = date?.getDay()
    return day !== 0 && day !== 6
    //0 means sunday
    //6 means saturday
  }

  bookingDatesFrom: Date[] = []
  bookingDatesTo:   Date[] = []
  bookingDates: Date[] = []

  onResourceChange(resourceItem:any) {
    const control = this.bookingForm.get("fromDateFromTime")
    console.log (resourceItem)
    this.isFeedBackVisible = false
    if (resourceItem.value !== '7') {
      this.showTime = true
      this.isTarifaVisible = true
      control.setValidators(Validators.required)
    } else if (resourceItem.value === '7') {
      this.showTime = false
      this.isTarifaVisible = false
      control.clearValidators()
      control.reset()
    }
    control.updateValueAndValidity()
  }

  /* addDateFrom(newDate: string) {const date = new Date(newDate); date.setHours(0, 0, 0, 0); this.bookingDatesFrom.push(date)}
  addDateTo(newDate: string) {const date = new Date(newDate); date.setHours(0, 0, 0, 0); this.bookingDatesTo.push(date)} */
  createDateArray(startDate: string, endDate: string) { 
    const start = new Date(startDate)
    const end = new Date(endDate)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)
    let currentDate = start; 
    while (currentDate <= end) { this.bookingDates.push(new Date(currentDate)); currentDate.setDate(currentDate.getDate() + 1) }
    this.bookingDates.forEach((resourceItem:any) => { this.bookingDatesFrom.push(resourceItem) })
   /*  this.bookingDates.forEach((resourceItem:any) => { this.bookingDatesTo.push(resourceItem) }) */
  }

  dateChangedActions(data:any) {
    let responseOK: boolean = false
    this.isFeedBackVisible = false
    this.toDate.setValue(data.value) /* Por defecto, hace que toDate sea el mismo que fromDate */
    if (this.bki_id.value === '7' ) { /* comprobar disponbilidad si es el Pavellón A */
      this.bookingService.getCheckAvailabilityADRBalears(this.bki_id.value, data.value, this.toDate.value)
      .subscribe((avalibility:any) => {
        if (avalibility.status === 'failure') {
          responseOK = false
        } else {
          responseOK = true
        }
        //this.showSnackBar ("AVAILABILITY ...")
        this.isFeedBackVisible = true
        this.sharedService.managementToast('postFeedback', responseOK, avalibility, 'availability')
        }, error => {
         responseOK = false
         this.showSnackBar ( error.message )
         this.sharedService.managementToast('postFeedback', responseOK, error.message)
        })
    }
  }

  rateChangedAction(hours: number) {
    let responseOK: boolean = false
    this.bookingService.getCheckAvailabilityADRBalears(
      this.bki_id.value, this.bookingForm.get('boo_start').value, this.bookingForm.get('boo_end').value)
    .subscribe((avalibility:any) => {
      if (avalibility.status === 'failure') {
       responseOK = false
      } else {
       responseOK = true
      }
      this.isFeedBackVisible = true
      if (responseOK) {
        this.showSnackBar ( "AVAILABILITY ..." )
      } else {
        this.showSnackBar ( "NO AVAILABILITY ..." )
      }
      this.sharedService.managementToast('postFeedback', responseOK, avalibility, 'availability')
      }, error => {
       responseOK = false
       this.showSnackBar ( error.message )
       this.sharedService.managementToast('postFeedback', responseOK, error.message)
      })
  }
  
  BookedDaysFilterFrom: (d: Date | null) => boolean = 
  (d: Date | null) => {
    if (!d) return false;
    const time = d.getTime();
    return !this.bookingDatesFrom.some(date => date.getTime() === time);
  }

  BookedDaysFilterTo: (d: Date | null) => boolean = 
  (d: Date | null) => {
    if (!d) return false;
    const time = d.getTime();
    return !this.bookingDatesTo.some(date => date.getTime() === time);
  }

  private showSnackBar(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 10000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar'],
    });
  }
}