import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from './shared.service';
import { Observable, catchError } from 'rxjs';
import { BookingDTO } from '../Models/booking.model';
import { designOrderDTO } from '../Models/design-order';
import { BookingADRBalearsDTO } from '../Models/booking.model';
import { WpPost } from '../Models/wp-post-data.dto';

const URL_API = '../../assets/phpAPI/'

const PRE_URL_BACKOFFICE = "https://pre.backoffice.idi.es/api"
const URL_BACKOFFICE = "https://backoffice.idi.es/api"
const token_bearer = "MEN2024*@"
const httpOptionsADRBalears = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token_bearer}` }) }

const WPpageURL = 'https://app.adrbalears.es/wp-json/wp/v2/pages';
const headers = new HttpHeaders()
      .set( 'Content-Type', 'application/vnd.api+json' ) 

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain' /* la única forma de evitar errores de CORS ha sido añadiendo esta cabecera */
  })
}

export interface updateResponse {
  affected: number;
}

export interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  
  constructor(
      private http: HttpClient,
      private sharedService: SharedService
            ) { }

  getAllBookings(): Observable<BookingDTO[]> {
    return this.http
      .get<BookingDTO[]>(`${URL_API}bookingGetAll.php`, httpOptions)
  }

  getAllBookingsByClient(companyId:any): Observable<BookingDTO[]> {
    return this.http
      .get<BookingDTO[]>(`${URL_API}bookingGetByClient.php?companyId=${companyId}`, httpOptions)
  }

  getBookingByResource(resource: string): Observable<BookingDTO[]> {
    return this.http
      .get<BookingDTO[]>(`${URL_API}bookingGetByResource.php?resource=${resource}`)
  }

  getBookingById(bookingId: string): Observable<BookingDTO> {
    return this.http
      .get<BookingDTO>(`${URL_API}bookingGetById.php?bookingId=${bookingId}`)
  }

  createBooking(booking: BookingDTO): Observable<BookingDTO> {
    return this.http
      .post<BookingDTO>(`${URL_API}bookingCreate.php`, booking)
      .pipe(catchError(this.sharedService.handleError));
  }

  createDesignRequest(booking: designOrderDTO): Observable<designOrderDTO> {
    return this.http
      .post<designOrderDTO>(`${URL_API}designOrderCreate.php`, booking)
      .pipe(catchError(this.sharedService.handleError));
  }

  getAllDesignRequests(): Observable<designOrderDTO[]> {
    return this.http
      .get<designOrderDTO[]>(`${URL_API}designOrdersGetAll.php`, httpOptions)
  }

  getAllDesignRequestsByClient(companyId:any): Observable<designOrderDTO[]> {
    return this.http
      .get<designOrderDTO[]>(`${URL_API}designOrderGetByClient.php?companyId=${companyId}`, httpOptions)
  }

  getDesignRequestById(orderID: string): Observable<designOrderDTO> {
    return this.http
      .get<designOrderDTO>(`${URL_API}designOrderGetById.php?orderID=${orderID}`)
  }

  updateDesignRequest(orderID: string, newState: string): Observable<any> {
    return this.http
      .patch<designOrderDTO>(`${URL_API}designOrderUpdate.php?orderID=${orderID}&newState=${newState}`, newState)
  }

  updateBooking(bookingId: string, booking: BookingDTO): Observable<BookingDTO> {
    return this.http
      .put<BookingDTO>(`${URL_API}bookingUpdate.php?bookingId=${bookingId}`, booking)
  }

  deleteBooking(bookingId: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}bookingDelete.php?bookingId=${bookingId}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  /* Obtener un contenido del gestor CMS app.adrbalears.es */
  getOneContent(id: string|null): Observable<WpPost> {
    return this.http.get<WpPost>(`${WPpageURL}/${id}`, { headers: headers })
  }
  /* -------------------------------------------------------------------------------------------------------- */
  
  /* BACKOFFICE ADR Balears */
  getAllBookingsADRBalears(): Observable<BookingADRBalearsDTO[]> {
    return this.http
      .get<BookingADRBalearsDTO[]>(`${URL_BACKOFFICE}/booking`, httpOptionsADRBalears)
  }

  getBookingByIdADRBalears(bookingId: string): Observable<BookingADRBalearsDTO> {
    return this.http
      .get<BookingADRBalearsDTO>(`${URL_BACKOFFICE}/booking/Locator=${bookingId}`, httpOptionsADRBalears)
  }

  getCheckAvailabilityADRBalears(bki_id: string, boo_start: Date, boo_end: Date): Observable<BookingADRBalearsDTO> {
    let pro_id: number = 42
    let start: string
    let end: string
    let hourMinStart: string = '08:00'
    let hourMinEnd: string = '20:00'

    let minutosStart: string = boo_start.toLocaleString("es-ES", { minute: "2-digit" })
    let minutosEnd: string = boo_end.toLocaleString("es-ES", { minute: "2-digit" })

    if (minutosStart.length === 1) {
      minutosStart = minutosStart+"0"
    }
    if (minutosEnd.length === 1) {
      minutosEnd = minutosEnd+"0"
    }

    /*     
    start = boo_start.getFullYear()+"-"+(boo_start.toLocaleString("es-ES", { month: "2-digit" }))+"-"+boo_start.toLocaleString("es-ES", { day: "2-digit" })+" "+boo_start.toLocaleString("es-ES", { hour: "2-digit" })+":"+minutosStart
    end   = boo_end.getFullYear()+"-"+(boo_end.toLocaleString("es-ES", { month: "2-digit" }))+"-"+boo_end.toLocaleString("es-ES", { day: "2-digit" })+" "+boo_end.toLocaleString("es-ES", { hour: "2-digit" })+":"+minutosEnd
    */

    if (bki_id !== '7') {
      start = boo_start.getFullYear()+"-"+(boo_start.toLocaleString("es", { month: "2-digit" })) +"-"+ boo_start.toLocaleString("es", { day: "2-digit" }) +" "+ hourMinStart
      end = boo_end.getFullYear()+"-"+(boo_end.toLocaleString("es", { month: "2-digit" })) +"-"+ boo_end.toLocaleString("es", { day: "2-digit" }) +" "+ hourMinEnd
    } else  {
      start = boo_start.getFullYear()+"-"+(boo_start.toLocaleString("es", { month: "2-digit" }))+"-"+boo_start.toLocaleString("es", { day: "2-digit" })+" "+boo_start.toLocaleString("es", { hour: "2-digit" })+":"+ minutosStart
      end = boo_end.getFullYear()+"-"+(boo_end.toLocaleString("es", { month: "2-digit" }))+"-"+boo_end.toLocaleString("es", { day: "2-digit" })+" "+boo_end.toLocaleString("es", { hour: "2-digit" })+":"+ minutosEnd
    }
    console.log (`checking availability for: ${start} - ${end}`)

    return this.http.get<BookingADRBalearsDTO>(`${URL_BACKOFFICE}/booking/-1/checkavailability?bki_id=${bki_id}&pro_id=${pro_id}&boo_start=${start}&boo_end=${end}`, httpOptionsADRBalears)
  }

  sendPostRequest(formData: any): Observable<BookingADRBalearsDTO> {
    let start: string
    let end: string
    let hourMinStart: string = '08:00'
    let hourMinEnd: string = '20:00'
    let minutosStart: string = formData.boo_start.toLocaleString("es-ES", { minute: "2-digit" })
    let minutosEnd: string = formData.boo_end.toLocaleString("es-ES", { minute: "2-digit" })

    if (minutosStart.length === 1) {
      minutosStart = minutosStart+"0"
    }
    if (minutosEnd.length === 1) {
      minutosEnd = minutosEnd+"0"
    }

    if (formData.fromDateFromTime !== undefined) {
      hourMinEnd = formData.fromDateFromTime
    }

    if (formData.bki_id !== '7') {
      start = formData.boo_start.getFullYear()+"-"+(formData.boo_start.toLocaleString("es", { month: "2-digit" })) +"-"+ formData.boo_start.toLocaleString("es", { day: "2-digit" }) +" "+ hourMinStart
      end = formData.boo_end.getFullYear()+"-"+(formData.boo_end.toLocaleString("es", { month: "2-digit" })) +"-"+ formData.boo_end.toLocaleString("es", { day: "2-digit" }) +" "+ hourMinEnd
    } else  {
      start = formData.boo_start.getFullYear()+"-"+(formData.boo_start.toLocaleString("es", { month: "2-digit" }))+"-"+formData.boo_start.toLocaleString("es", { day: "2-digit" })+" "+formData.boo_start.toLocaleString("es", { hour: "2-digit" })+":"+ minutosStart
      end = formData.boo_end.getFullYear()+"-"+(formData.boo_end.toLocaleString("es", { month: "2-digit" }))+"-"+formData.boo_end.toLocaleString("es", { day: "2-digit" })+" "+formData.boo_end.toLocaleString("es", { hour: "2-digit" })+":"+ minutosEnd
    }
    let dataToADRBalears: BookingADRBalearsDTO = {
    "usucre": formData.usucre,
    "bki_id": formData.bki_id,
    "pro_id": formData.pro_id,
    "bkr_id": formData.bkr_id,
    "boo_start": start,
    "boo_end": end,
    "boo_company": {"name": formData.boo_company.name, "cif": formData.boo_company.cif, "contact": formData.boo_company.contact, "email": formData.boo_company.email},
    "boo_title": formData.boo_title,
    "bookdetails": [{"start": start, "end": end}]
    }
    console.log ("enviado a backoffice: ", dataToADRBalears)
    const headers = new HttpHeaders({'Authorization': `Bearer ${token_bearer}`, 'Content-Type': 'application/json; charset=utf-8'})
    return this.http.post<BookingADRBalearsDTO>(`${URL_BACKOFFICE}/booking`, dataToADRBalears, { headers })
  }

}
