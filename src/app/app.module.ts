import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { UtilsModule } from "./utils/module";
import { FormatBookingPipe } from './Pipe/format-quantity.pipe';
import { BookingCalendarFormComponent } from './booking-calendar-form/booking-calendar-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { BookingCalendarChildComponent } from './booking-calendar-child/booking-calendar-child.component';


@NgModule({
    declarations: [
        AppComponent,
        BookingCalendarFormComponent,
        FormatBookingPipe,
        BookingCalendarChildComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
        UtilsModule,
        BrowserAnimationsModule
    ]
})
export class AppModule { }
