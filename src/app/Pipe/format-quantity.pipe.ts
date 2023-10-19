import { Pipe, PipeTransform } from '@angular/core';

interface booking {
  resourceToBook: string;
  fromDate: Date;
  toDate: Date;
}

@Pipe({
  name: 'formatBooking',
})

export class FormatBookingPipe implements PipeTransform {

  transform(value: booking, ...args: number[]): unknown {
    
    let resource: string
    let fromDate: Date
    let toDate: Date
    let theBooking: booking 
    let newFormat: string = ""

    if ( value === null ) {
        return value
    } 
    
    theBooking = value
    /* console.log (theBooking['resourceToBook'], theBooking['fromDate'], theBooking['toDate']) */
   
    let type: number = args[0];

    if (type === 1) {

      if (theBooking['resourceToBook']) {
        newFormat = "Recurso: " + theBooking['resourceToBook']
      }
      if (theBooking['fromDate']) {
        newFormat = newFormat + " Desde: " + theBooking['fromDate']
      }
      if (theBooking['toDate']) {
        newFormat = newFormat + " Hasta: " + theBooking['toDate']
      }
                
    }

    if (type === 2) { //quantity and residue destination
        newFormat =  ""
    }

    if (type === 3) { //quantity and residue destination in html format
        newFormat =  ""
    }

    return newFormat

  }

  private needZero(checkNumber: number): string {
    return checkNumber < 10 ? '0' + checkNumber : String(checkNumber);
  }
}


