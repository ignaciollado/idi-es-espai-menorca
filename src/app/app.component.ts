import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation, Input 
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { colors } from './utils/colors';

import {
  addDays,
  addHours,
  isSameDay,
  setDay,
  startOfDay,
  subDays,
  subSeconds,
} from 'date-fns';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  view: CalendarView = CalendarView.Week
  viewDate: Date = new Date()
  isDragable: boolean = false
  isbeforeStart: boolean = false
  isafterEnd: boolean = false
  @Input() bookingData: string = ""

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

  refresh = new Subject<void>();

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

  eventTimesChanged(
    eventTimesChangedEvent: CalendarEventTimesChangedEvent
  ): void {
    delete eventTimesChangedEvent.event.cssClass;
    if (this.validateEventTimesChanged(eventTimesChangedEvent, false)) {
      const { event, newStart, newEnd } = eventTimesChangedEvent;
      event.start = newStart;
      event.end = newEnd;
      this.refresh.next();
    }
  }
}
