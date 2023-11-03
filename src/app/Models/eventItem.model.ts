export class EventDTO {
    start: string;
    end: number;
    title: string
    color: string
    allDay: boolean
    resizable: {
        beforeStart: boolean
        afterEnd: boolean
        }
    draggable: boolean


    constructor(
        start: string,
        end: number,
        title: string,
        color: string,
        allDay: boolean,
        resizable: {
            beforeStart: boolean
            afterEnd: boolean
            },
        draggable: boolean
      ) {

        this.start = start,
        this.end = end,
        this.title = title,
        this.color = color,
        this.allDay = allDay,
        this.resizable = resizable,
        this.draggable = draggable
      }
}
