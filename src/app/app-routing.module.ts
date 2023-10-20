import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingCalendarChildComponent } from './booking-calendar-child/booking-calendar-child.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  routes = [{ path: '**', component: BookingCalendarChildComponent }]
}
