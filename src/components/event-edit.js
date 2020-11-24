import { AbstractComponent } from "./abstract-component";
import { getRandomBoolean, types, citiesArr, getTitleByType } from "./data";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import flatpickr from "flatpickr";

/* eslint-disable indent */
export class EventEdit extends AbstractComponent {
  constructor({
    typeEventTransfer,
    photos,
    description,
    isDateStart,
    isDateEnd,
    eventOffer,
    favorites,
    city,
    price,
  }) {
    super();
    this._typeEventTransfer = typeEventTransfer;
    this._city = city;
    this._price = price;
    this._photos = photos;
    this._description = description;
    this._isDateStart = isDateStart;
    this._isDateEnd = isDateEnd;
    this._favorites = favorites;
    this._eventOffer = eventOffer;

    this._onChangeTypeEvent();
    this._onChangeEventDestination();
    // this._flatpickr();
  }

  getTemplate() {
    const COUNT_PHOTO = 5;

    const getTypeItems = (obj) => {
      return Object.keys(obj)
        .map((type) => {
          return `
            <div class="event__type-item">
              <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" 
              ${type === this._typeEventTransfer ? `checked` : ``}>
              <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
              ${type[0].toUpperCase() + type.slice(1)}</label>
            </div>
          `;
        })
        .join(``);
    };

    return `
    <form class="event  event--edit" action="#" method="post">
   <header class="event__header">
     <div class="event__type-wrapper">
       <label class="event__type  event__type-btn" for="event-type-toggle-1">
         <span class="visually-hidden">Choose event type</span>
         <img class="event__type-icon" width="17" height="17" src="img/icons/${
           this._typeEventTransfer
         }.png" alt="Event type icon">
       </label>
       <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
  
       <div class="event__type-list">
       ${types
         .map((objTypes) => {
           return `
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${getTypeItems(objTypes)}
            </fieldset>
          `;
         })
         .join(``)} 
       </div>
     </div>
  
     <div class="event__field-group  event__field-group--destination">
       <label class="event__label  event__type-output" for="event-destination-1">
         ${getTitleByType(this._typeEventTransfer)}
       </label>
       <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${
         this._city
       }" list="destination-list-1">
       <datalist id="destination-list-1">
       ${citiesArr.map(
         (city) => `
      <option value="${city}"></option>
      `
       )}
       </datalist>
     </div>
  
     <div class="event__field-group  event__field-group--time">
       <label class="visually-hidden" for="event-start-time-1">
         From
       </label>
       <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${
         this._isDateStart.dayPresent
       }/${+this._isDateStart.monthNumber}/${this._isDateStart.year} ${
      this._isDateStart.timePresent
    }"> 
       —
       <label class="visually-hidden" for="event-end-time-1">
         To
       </label>
       <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${+this
         ._isDateEnd.dayPresent}/${+this._isDateEnd.monthNumber}/${
      this._isDateEnd.year
    } ${+this._isDateEnd.hours}:${this._isDateEnd.minutes}">
     </div>
  
     <div class="event__field-group  event__field-group--price">
       <label class="event__label" for="event-price-1">
         <span class="visually-hidden">Price</span>
         €
       </label>
       <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${
         this._price
       }">
     </div>
  
     <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
     <button class="event__reset-btn" type="reset">Delete</button>
     <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${
       this._favorites ? `checked` : ``
     }>
     <label class="event__favorite-btn" for="event-favorite-1">
       <span class="visually-hidden">Add to favorite</span>
       <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
         <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
       </svg>
     </label>

     <button class="event__rollup-btn" type="button">
       <span class="visually-hidden">Open event</span>
     </button>
   </header>
   <section class="event__details">
     <section class="event__section  event__section--offers">
       <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
       <div class="event__available-offers">
               ${this._eventOffer
                 .map(
                   (elem) => `
               <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${
                  elem.title
                }-1" type="checkbox" name="event-offer-${elem.title}" ${
                     elem.accepted ? `checked` : ``
                   }>
                <label class="event__offer-label" for="event-offer-${
                  elem.title
                }-1">
                  <span class="event__offer-title">${
                    elem.title
                  }</span> + €&nbsp;<span class="event__offer-price">${
                     elem.price
                   }</span>
               </label>
             </div>
               `
                 )
                 .join(``)}
       </div>
     </section>
     <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">
          ${this._description}
        </p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
                  ${new Array(COUNT_PHOTO)
                    .fill(``)
                    .map(
                      () => `
                    <img class="event__photo" src="http://picsum.photos/300/150?r=${Math.random(
                      this._photos
                    )}" alt="Event photo">
                  `
                    )
                    .join(``)}
          </div>
        </div>
        </section>
   </section>
    </form>
  `;
  }

  _flatpickr() {
    flatpickr(this.getElement().querySelector(`.event__input--time`), {
      altInput: true,
      allowInput: true,
      defaultDate: Date.now(),
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });
  }

  _onChangeTypeEvent() {
    const typeList = this.getElement().querySelector(`.event__type-list`);

    typeList.addEventListener(`click`, (event) => {
      const { target } = event;
      if (target.tagName !== `INPUT`) {
        return;
      }

      const type = target.value;

      this.getElement().querySelector(
        `.event__type-output`
      ).textContent = getTitleByType(type);

      this.getElement().querySelector(
        `.event__type-icon`
      ).src = `img/icons/${type}.png`;

      this.getElement()
        .querySelectorAll(`.event__offer-checkbox`)
        .forEach((eventCheck) => {
          eventCheck.checked = getRandomBoolean();
        });
    });
  }

  _onChangeEventDestination() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`input`, ({ target }) => {
        const input = this.getElement().querySelector(
          `.event__destination-description`
        );
        citiesArr.forEach((city) => {
          if (target.value === city) {
            input.textContent = this._description;
          }
        });
      });
  }
}
