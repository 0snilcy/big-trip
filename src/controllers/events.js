import { TripEvents } from "../components/trip-events";
import { EventEdit } from "../components/event-edit";
import { Event } from "../components/event";
import { renderWithChildren } from "../components/utils";
import { Mode } from "./trip";

export const actionsEvent = {
  update: `update`,
  create: `create`,
  delete: `delete`,
};

export const eventState = {
  LOADING: `LOADING`,
  READY: `READY`,
};

const btnState = {
  SAVING: `Saving`,
  DELETING: `Deleting`,
};

export class EventController {
  constructor(event, onDataChange, onChangeView, mode) {
    this._event = event;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._mode = mode;
    this._event.domEvent = null;
    this._event.domEventEdit = null;
    this._btnEventSave = null;
    this._btnEventDelete = null;
  }

  getObjDate(date) {
    const [dayPresent, monthNumber, year, hours, minutes] = date.split(
      /[\s:\/]/g
    );

    return {
      dayPresent,
      monthNumber,
      year,
      hours,
      minutes,
      timePresent: `${hours}:${minutes}`,
    };
  }

  _updateOffers(el, formData) {
    return el.eventOffer.map((offer) => {
      offer.accepted = formData.get(`event-offer-${offer.title}`) === `on`;
      return offer;
    });
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        if (this._mode === Mode.DEFAULT) {
          this._event.closeEdit();
        } else if (this._mode === Mode.ADDING) {
          this._onDataChange(null, null);
        }

        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._event.domEvent = new Event(this._event).getElement();
    this._event.domEventEdit = new EventEdit(this._event).getElement();
    this._btnEventSave = this._event.domEventEdit.querySelector(
      `.event__save-btn`
    );
    this._btnEventDelete = this._event.domEventEdit.querySelector(
      `.event__reset-btn`
    );

    let currentEvent = this._event.domEvent;
    if (this._mode === Mode.ADDING) {
      currentEvent = this._event.domEventEdit;
      document.addEventListener(`keydown`, onEscKeyDown);
    }

    // if (this._event.domEvent) {
    this._event.showEdit = () =>
      this._event.domEvent.parentNode.replaceChild(
        this._event.domEventEdit,
        this._event.domEvent
      );

    this._event.closeEdit = () =>
      this._event.domEventEdit.parentNode.replaceChild(
        this._event.domEvent,
        this._event.domEventEdit
      );

    this._btnEventSave.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._event.domEventEdit);

      const dateChangeStart = formData.get(`event-start-time`);
      const dateChangeEnd = formData.get(`event-end-time`);

      this._event.typeEventTransfer = formData.get(`event-type`);
      this._event.city = formData.get(`event-destination`);
      this._event.description = this._event.description;
      this._event.randomTimeTransit = this._event.randomTimeTransit;
      this._event.isDateStart = this.getObjDate(dateChangeStart);
      this._event.isDateEnd = this.getObjDate(dateChangeEnd);
      this._event.price = formData.get(`event-price`);
      this._event.favorites = formData.get(`event-favorite`) === `on`;
      this._event.eventOffer = this._updateOffers(this._event, formData);

      this._setState(eventState.LOADING, btnState.SAVING);

      this._onDataChange(
        this._mode === Mode.ADDING ? actionsEvent.create : actionsEvent.update,
        this._event,
        () => this._setState(eventState.READY, btnState.SAVING)
      );

      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._btnEventDelete.addEventListener(`click`, () => {
      this._setState(eventState.LOADING, btnState.DELETING);

      this._onDataChange(actionsEvent.delete, this._event, () =>
        this._setState(eventState.READY, btnState.DELETING)
      );
    });

    const btnEvent = this._event.domEvent.querySelector(".event__rollup-btn");
    const btnEventEdit = this._event.domEventEdit.querySelector(
      ".event__rollup-btn"
    );

    btnEvent.addEventListener("click", () => {
      this._onChangeView(this._event);
      this._event.showEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    btnEventEdit.addEventListener(`click`, () => {
      if (this._mode === Mode.ADDING) {
        return;
      } else {
        this._event.closeEdit();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    });
    // }
    return renderWithChildren(new TripEvents().getElement(), currentEvent);
  }

  _setState(state, btn) {
    if (this._event.domEventEdit.classList.contains("shake")) {
      this._event.domEventEdit.classList.remove("shake");
    }

    this._event.domEventEdit.querySelector(`.event__type-toggle`).disabled =
      state === eventState.LOADING;
    this._event.domEventEdit.querySelector(
      `.event__input--destination`
    ).disabled = state === eventState.LOADING;
    this._event.domEventEdit.querySelector(`.event__input--time`).disabled =
      state === eventState.LOADING;
    this._event.domEventEdit.querySelector(`.event__input--price`).disabled =
      state === eventState.LOADING;
    this._btnEventDelete.disabled = state === eventState.LOADING;
    this._btnEventSave.disabled = state === eventState.LOADING;

    /* eslint-disable */
    switch (state) {
      case eventState.LOADING:
        if (btn === btnState.SAVING) {
          this._btnEventSave.textContent = `${btn}...`;
        } else {
          this._btnEventDelete.textContent = `${btn}...`;
        }
        break;

      case eventState.READY:
        this._event.domEventEdit.classList.add(`border-error`);
        this._event.domEventEdit.classList.add(`shake`);

        if (btn === btnState.SAVING) {
          this._btnEventSave.textContent = `Save`;
        } else {
          this._btnEventDelete.textContent = `Delete`;
        }
        break;
    }
  }
}
