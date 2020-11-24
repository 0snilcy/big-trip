import { getDate, setDate, differenceDate } from "./utils";

export class ModelEvent {
  constructor(data) {
    this.id = data[`id`];
    this.typeEventTransfer = data[`type`];
    this.isDateStart = getDate(new Date(data[`date_from`]));
    this.isDateEnd = getDate(new Date(data[`date_to`]));
    this.description = data[`destination`][`description`];
    this.city = data[`destination`][`name`];
    this.photos = data[`destination`][`pictures`];
    this.price = data[`base_price`];
    this.isFavorite = data[`is_favorite`];
    this.eventOffer = data[`offers`];
    this.destination = data[`destination`];
    this.difference = differenceDate(
      Math.abs(data[`date_from`] - data[`date_to`])
    );
  }

  static parseEvent(data) {
    return new ModelEvent(data);
  }

  static parseEvents(data) {
    return data.map((event) => ModelEvent.parseEvent(event));
  }

  // prettier-ignore
  toRAW() {
    return {
      'id': this.id,
      'type': this.typeEventTransfer,
      'date_from': setDate(this.isDateStart),
      'date_to': setDate(this.isDateEnd),
      'base_price': +this.price,
      'is_favorite': this.isFavorite,
      'offers': this.eventOffer,
      'destination': {
        'name': this.city,
        'description': this.description,
        'pictures': this.photos
      }
    };
  }
}
