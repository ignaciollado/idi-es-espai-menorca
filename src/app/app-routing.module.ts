import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingCalendarFormComponent } from './booking-calendar-form/booking-calendar-form.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  routes = [{ path: '**', component: BookingCalendarFormComponent }]
}
