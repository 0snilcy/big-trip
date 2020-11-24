import { getTitleByType } from "./data";
import { AbstractComponent } from "./abstract-component";

/* eslint-disable indent */
export class Event extends AbstractComponent {
  constructor({
    typeEventTransfer,
    isDateStart,
    isDateEnd,
    eventOffer,
    price,
    city,
    icon,
    typeOutput,
    typeEventActivity,
    difference,
  }) {
    super();
    this._typeEventActivity = typeEventActivity;
    this._typeOutput = typeOutput;
    this._icon = icon;
    this._typeEventTransfer = typeEventTransfer;
    this._isDateStart = isDateStart;
    this._isDateEnd = isDateEnd;
    this._eventOffer = eventOffer;
    this._price = price;
    this._city = city;
    this._difference = difference;
  }

  getTemplate() {
    return `
<div class="event">
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${
      this._typeEventTransfer
    }.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${getTitleByType(this._typeEventTransfer)} ${
      this._city
    }</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${this._isDateStart.year}-${
      this._isDateStart.month
    }-${this._isDateStart.dayPresent}T${this._isDateStart.timePresent}">${
      this._isDateStart.timePresent
    }</time>
      —
      <time class="event__end-time" datetime="${this._isDateEnd.year}-${
      this._isDateEnd.month
    }-${this._isDateEnd.dayPresent}T${this._isDateEnd.hours}:${
      this._isDateEnd.minutes
    }">${this._isDateEnd.hours}:${this._isDateEnd.minutes}</time>
    </p>
    <p class="event__duration">${this._difference.hours}H ${
      this._difference.minutes
    }M</p>
  </div>
  <p class="event__price">
    €&nbsp;<span class="event__price-value">${this._price}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${this._eventOffer
      .map((objOffer) => {
        return objOffer.accepted
          ? `<li class="event__offer">
      <span class="event__offer-title">${objOffer.title}</span>
      +
      €&nbsp;<span class="event__offer-price">${objOffer.price}</span>
     </li>`
          : ``;
      })
      .join(``)}
  </ul>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>`;
  }
}
