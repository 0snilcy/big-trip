import { Day } from "../components/day";
import { EventController } from "./events";
import { Mode } from "./trip";

export class DaysController {
  constructor(days, onDataChange, onChangeView, mode, defaulfEvent) {
    this._days = days;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._mode = mode;
    this._defaulfEvent = defaulfEvent;
  }

  create() {
    if (this._mode === Mode.ADDING) {
      this._days[0] = [this._defaulfEvent, ...this._days[0]];
    }

    const daysMarkup = document.createDocumentFragment();
    this._days.forEach((dayOfEventsData, id) => {
      const arrEvents = document.createDocumentFragment();
      dayOfEventsData.forEach((el) => {
        this._event = new EventController(
          el,
          this._onDataChange,
          this._onChangeView,
          el === this._defaulfEvent ? this._mode : Mode.DEFAULT
        );
        const tripEvents = this._event.init();
        arrEvents.append(tripEvents);
      });

      const day = new Day(
        id,
        arrEvents,
        dayOfEventsData[0].isDateStart
      ).getElement();
      daysMarkup.append(day);
    });
    return daysMarkup;
  }
}
