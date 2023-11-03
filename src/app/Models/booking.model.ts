export class BookingDTO {
    bookingId!: string
    idCard: number
    name: string
    email: string
    resource: string
    fromDate: Date
    toDate: Date
    allDay: boolean
    state: string


    constructor(
        fromDate: Date,
        toDate: Date,
        idCard: number,
        name: string,
        email: string,
        resource: string,
        allDay: boolean,
        state: string
      ) {

        this.fromDate = fromDate,
        this.toDate = toDate,
        this.idCard = idCard,
        this.name = name,
        this.email = email,
        this.resource = resource,
        this.allDay = allDay,
        this.state = state
      }
}
