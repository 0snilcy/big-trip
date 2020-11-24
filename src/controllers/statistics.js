import { Statistics } from "../components/statistics";
import { render } from "../components/utils";
import { pageBodyContainer } from "./main";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { types } from "../components/data";

export class StatisticsController {
  constructor(days) {
    this._days = days;
    this._statistics = new Statistics().getElement();
    this._statisticsDom = pageBodyContainer.querySelector(`.statistics`);
  }

  init(check) {
    // this.show();

    if (check) {
      pageBodyContainer.removeChild(this._statisticsDom);
    }

    render(pageBodyContainer, this._statistics);
    this._renderCharts();
    this.hide();
  }

  _renderCharts() {
    const moneyStx = this._statistics.querySelector(
      `.statistics__chart--money`
    );

    // Берем ключи объекта types и закидываем их в массив emptyArray
    const emptyArray = [];
    types.map((obj) => {
      const arrObjectKeys = Object.keys(obj);
      arrObjectKeys.forEach((el) => {
        emptyArray.push(el);
      });
      return arrObjectKeys;
    });

    // Проверка соответствия - сколько типов в массиве emptyArray с данными в массиве this._days
    const arrCountType = emptyArray.map((type) => {
      let sumPrice = 0;
      this._days
        .map((day) => day.filter((elem) => type === elem.typeEventTransfer))
        .filter((el) => el.length)
        .forEach((event) => {
          event.forEach((element) => {
            sumPrice += element.price;
          });
        });
      return sumPrice;
    });

    arrCountType.sort(function (a, b) {
      return b - a;
    });

    const moneyChart = new Chart(moneyStx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: emptyArray,
        datasets: [
          {
            data: arrCountType,
            backgroundColor: `#ffffff`,
            borderColor: `#000`,
            barThickness: 40,
            // barPercentage: 25.0,
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            display: false,
          },
        },
        title: {
          display: true,
          text: "MONEY",
          position: `left`,
          fontSize: 18,
        },
        legend: {
          display: false,
        },
        tooltips: {
          intersect: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    });
  }

  hide() {
    this._statistics.classList.add(`visually-hidden`);
  }

  show() {
    this._statistics.classList.remove(`visually-hidden`);
  }
}
