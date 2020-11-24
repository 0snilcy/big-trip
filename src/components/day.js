import { renderWithChildren } from "./utils.js";
import { AbstractComponent } from "./abstract-component.js";

export class Day extends AbstractComponent {
  constructor(counter, children, date) {
    super();
    this._date = date;
    this._counter = counter;
    this._children = children;
  }

  getElement() {
    if (!this._element) {
      this._element = renderWithChildren(this.getTemplate(), this._children);
    }
    return this._element;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${this._counter + 1}</span>
      <time class="day__date" datetime="${this._date.dayPresent}-${
      this._date.monthNumber
    }-${this._date.year}">${this._date.month} ${this._date.dayPresent}</time>
    </div>
    <ul class="trip-events__list">
      <children />
    </ul>
  </li>`;
  }
}
