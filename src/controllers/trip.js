import { render, renderWithChildren, copyArr } from "../components/utils";
import { DaysController } from "./days";
import { TripDay } from "../components/trip-days";
import { Sort } from "../components/sort";
import { ModelEvent } from "../components/model-event";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

export class TripController {
  constructor(days, onDataChange) {
    this._days = days;
    this._onDataChange = onDataChange;
    this._tripDays = renderWithChildren(
      new TripDay().getElement(),
      this._renderDays(this._days)
    );
    this._sort = new Sort();
    this._tripEventsDom = document.querySelector(`.trip-events`);
    this._sortDom = this._tripEventsDom.querySelector(`.trip-sort`);
    this._tripDaysDom = this._tripEventsDom.querySelector(`.trip-days`);
    this._creatingEvent = null;
    this._activeEvent = null;
  }

  init(check) {
    if (check) {
      this._tripEventsDom.removeChild(this._sortDom);
      this._tripEventsDom.removeChild(this._tripDaysDom);
    }

    render(this._tripEventsDom, this._sort.getElement());
    render(this._tripEventsDom, this._tripDays);

    this._sort
      .getElement()
      .addEventListener(`click`, (evt) => this._onClickSort(evt));
  }

  _renderDays(days) {
    return new DaysController(
      days,
      this._onDataChange,
      this._onChangeView.bind(this),
      Mode.DEFAULT
    ).create();
  }

  /* eslint-disable */
  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    const defaultEvent = {
      id: "",
      date_to: Date.now(),
      date_from: Date.now() + Math.pow(7, 10),
      base_price: 400,
      is_favorite: false,
      type: "drive",
      offers: [
        { title: "Choose live music", price: 80, accepted: false },
        { title: "Choose VIP area", price: 150, accepted: true },
        { title: "Order a breakfast", price: 90, accepted: true },
      ],
      destination: {
        description:
          "Monaco, is a beautiful city, with an embankment of a mighty river as a centre of attraction, full of of cozy canteens where you can try the best coffee in the Middle East.",
        name: "Monaco",
        pictures: [
          {
            src: "http://picsum.photos/300/200?r=0.9957317523090607",
            description: "Frankfurt street market",
          },
          {
            src: "http://picsum.photos/300/200?r=0.30120342442988113",
            description: "Frankfurt park",
          },
          {
            src: "http://picsum.photos/300/200?r=0.22926650020860162",
            description: "Frankfurt embankment",
          },
        ],
      },
    };

    const eventToModel = new ModelEvent(defaultEvent);

    this._creatingEvent = new DaysController(
      this._days,
      this._onDataChange,
      this._onChangeView.bind(this),
      Mode.ADDING,
      eventToModel
    );

    this._cleanContainer();
    render(this._tripDays, this._creatingEvent.create());
  }

  _onChangeView(event) {
    if (
      this._activeEvent &&
      event !== this._activeEvent &&
      this._activeEvent.domEventEdit.parentNode
    ) {
      this._activeEvent.closeEdit();
    }

    this._activeEvent = event;
  }

  _update(data) {
    this._tripDays.innerHTML = ``;
    render(this._tripDays, this._renderDays(data));
  }

  _cleanContainer() {
    this._tripDays.innerHTML = ``;
  }

  hide() {
    this._tripEventsDom.classList.add(`visually-hidden`);
  }

  show() {
    this._tripEventsDom.classList.remove(`visually-hidden`);
  }

  /* eslint-disable */
  _onClickSort(evt) {
    const daysArr = copyArr(this._days);
    const { sortType, sortDirection } = evt.target.dataset;

    if (!sortType) {
      return;
    }

    const direction = +sortDirection;
    evt.target.dataset.sortDirection = direction ? 0 : 1;

    switch (sortType) {
      case `time`:
        const sortedTime = daysArr.map((day) =>
          day.sort((first, last) =>
            direction
              ? first.difference.hours - last.difference.hours
              : last.difference.hours - first.difference.hours
          )
        );

        this._update(sortedTime);
        break;

      case `price`:
        const sortedPrice = daysArr.map((day) =>
          day.sort((first, last) =>
            direction ? last.price - first.price : first.price - last.price
          )
        );
        this._update(sortedPrice);
        break;

      case `default`:
        this._update(this._days);
        break;
    }
  }
}
