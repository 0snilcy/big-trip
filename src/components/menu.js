import { AbstractComponent } from "./abstract-component";

export class Menu extends AbstractComponent {
  getElement() {
    return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" data-event-click="table" href="#">Table</a>
      <a class="trip-tabs__btn" data-event-click="stats" href="#">Stats</a>
    </nav>
    `;
  }
}
