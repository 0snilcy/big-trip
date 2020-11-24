import { getEvent } from "../components/data";
import { TripController } from "../controllers/trip";
import { createFilter } from "../components/filter";
import { createMenuInfo } from "../components/menu-info";
import { Menu } from "../components/menu";
import { getMenuData } from "../components/data";
import { render } from "../components/utils";
import { StatisticsController } from "./statistics";

const pageBody = document.querySelector(`.page-body`);
const tripMain = pageBody.querySelector(`.trip-main`);
const pageMain = pageBody.querySelector(`.page-main`);
export const pageBodyContainer = pageMain.querySelector(
  `.page-body__container`
);
export class MainController {
  constructor(onDataChange) {
    this._onDataChange = onDataChange;
    this._menu = new Menu();
    this._statisticsController = null;
    this._tripController = null;
    this._renderCheck = false;

    this._tripMenu = tripMain.querySelector(`.trip-controls`);
    this._days = null;
  }

  init(events) {
    this._renderDaysIsEvent(events);
    this._statisticsController = new StatisticsController(this._days);
    this._tripController = new TripController(this._days, this._onDataChange);
    this._renderPage();
  }

  _renderPage() {
    const tripMenuFirstTitle = this._tripMenu.querySelector(`.visually-hidden`);

    if (this._renderCheck) {
      this._tripController.init(this._renderCheck);
      this._statisticsController.init(this._renderCheck);
    } else {
      render(tripMain, createMenuInfo(this._days, getMenuData()), `afterBegin`);
      render(tripMenuFirstTitle, this._menu.getElement(), `afterEnd`);
      render(this._tripMenu, createFilter());
      this._tripController.init(this._renderCheck);
      this._statisticsController.init();
    }

    this._renderCheck = true;

    /* eslint-disable */
    // Добавление обработчика события на кнопки - статистика/таблица
    const tripBtnTabs = tripMain.querySelector(`.trip-tabs`);
    tripMain.addEventListener(`click`, (evt) => {
      const { target } = evt;

      if (target.tagName !== `A` && target.tagName !== `BUTTON`) {
        return;
      }

      if (target.tagName === `A`) {
        if (Array.from(target.classList).includes(`trip-tabs__btn--active`)) {
          return;
        } else {
          Array.from(tripBtnTabs.children).forEach((btn) => {
            btn.classList.toggle(`trip-tabs__btn--active`);
          });
        }
      }

      switch (target.dataset.eventClick) {
        case "stats":
          this._tripController.hide();
          this._statisticsController.show();
          break;

        case "table":
          this._tripController.show();
          this._statisticsController.hide();
          break;

        case "addEvent":
          this._tripController.createEvent();
          break;
      }
    });
  }

  _renderDaysIsEvent(events) {
    const days = {};
    events.forEach((event) => {
      const { isDateStart } = event;
      const day = isDateStart.month + isDateStart.dayPresent;
      days[day] = days[day] ? [...days[day], event] : [event];
      console.log(event);
    });

    this._days = Object.values(days);
  }
}
