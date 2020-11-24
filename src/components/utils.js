export const getDate = (date) => {
  const dateObjToArr = date.toDateString().split(` `);
  const dateObj = {
    dayOfWeek: dateObjToArr[0],
    month: dateObjToArr[1],
    monthNumber: date.getMonth(),
    dayPresent: date.getDate(),
    year: date.getFullYear(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    timePresent: date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    }),
  };
  return dateObj;
};

export const setDate = ({ monthNumber, dayPresent, year, hours, minutes }) => {
  return new Date(year, monthNumber, dayPresent, hours, minutes).getTime();
};

export const differenceDate = (difference) => {
  let delta = difference / 1000;
  let days = Math.floor(delta / 86400);
  delta -= days * 86400;
  let hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  let minutes = Math.floor(delta / 60) % 60;
  return { hours: hours, minutes: minutes };
};

export const render = (container, element, posititon = `beforeEnd`) => {
  const div = document.createElement(`div`);
  if (typeof element === "string") {
    div.innerHTML = element;
    container.insertAdjacentHTML(posititon, element);
  } else {
    container.append(element);
  }
  return container;
};

export const upperCase = (elem) => {
  return !elem ? elem : elem[0].toUpperCase() + elem.slice(1);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const copyArr = (arr) =>
  Array.from(arr, (value) => (Array.isArray(value) ? copyArr(value) : value));

export const renderWithChildren = (parent, children) => {
  let domParent = parent;

  if (typeof parent === "string") {
    domParent = createElement(parent);
  }
  const childrenContainer = domParent.querySelector("children");

  if (childrenContainer) {
    childrenContainer.replaceWith(children);
  }
  return domParent;
};
