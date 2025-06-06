import "./styles.css";
import getIcon from "./imageLoader";
import { fahrenheitToCelsius } from "./tempconverter";

const loc = document.querySelector("#location");
const weatherData = document.querySelector("#weather-data");
const form = document.querySelector("form");
const query = document.querySelector("#search");
let tempPreference = "Fahrenheit";
const tempPreferenceButton = document.querySelector("#preferred-unit");
let currentData = null;

tempPreferenceButton.addEventListener("click", () => {
  tempPreference = tempPreference === "Fahrenheit" ? "Celsius" : "Fahrenheit";
  tempPreferenceButton.innerHTML = tempPreference;
  if (currentData !== null) {
    transformWeatherData();
  }
});

function getPreferredTemperature(temperatureInFahrenheit) {
  if (tempPreference === "Fahrenheit") {
    return temperatureInFahrenheit;
  } else {
    return fahrenheitToCelsius(temperatureInFahrenheit);
  }
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

function makeDayCard(
  date,
  icon,
  currentTemperature,
  feelsLikeTemperature,
  description,
  maxTemperature,
  minTemperature,
  isToday,
) {
  const card = document.createElement("div");
  card.classList.add("weather-card");

  if (isToday) {
    card.classList.add("today");
  }

  if (!isToday) {
    const datePara = document.createElement("p");
    datePara.classList.add("date");
    datePara.textContent = date;
    card.appendChild(datePara);
  }

  const weatherIcon = document.createElement("img");
  weatherIcon.classList.add("weather-icon");
  getIcon(icon, weatherIcon);
  weatherIcon.alt = icon;
  card.appendChild(weatherIcon);

  const currentTempPara = document.createElement("p");
  currentTempPara.classList.add("current-temp");
  currentTempPara.innerHTML = currentTemperature + "&deg;";
  card.appendChild(currentTempPara);

  if (feelsLikeTemperature !== "") {
    const feelsLikeTempPara = document.createElement("p");
    feelsLikeTempPara.classList.add("feels-like");
    feelsLikeTempPara.innerHTML =
      "Feels like " + feelsLikeTemperature + "&deg;";
    card.appendChild(feelsLikeTempPara);
  }

  if (description !== "") {
    const descriptionPara = document.createElement("p");
    descriptionPara.classList.add("description");
    descriptionPara.textContent = description;
    card.appendChild(descriptionPara);
  }

  const maxTempPara = document.createElement("p");
  maxTempPara.classList.add("max-temp");
  maxTempPara.innerHTML = "High: " + maxTemperature + "&deg;";
  card.appendChild(maxTempPara);

  const minTempPara = document.createElement("p");
  minTempPara.classList.add("min-temp");
  minTempPara.innerHTML = "Low: " + minTemperature + "&deg;";
  card.appendChild(minTempPara);

  weatherData.appendChild(card);
}

function transformWeatherData() {
  removeAllChildren(weatherData);
  loc.textContent = currentData.resolvedAddress;

  for (let i = 0; i < currentData.days.length; i++) {
    const date = new Date(currentData.days[i].datetime).toLocaleDateString(
      "en-US",
    );
    const icon = currentData.days[i].icon;
    const description = i === 0 ? currentData.days[i].description : "";
    const currentTemp = Math.round(
      getPreferredTemperature(currentData.days[i].temp),
    );
    const feelsLike =
      i === 0
        ? Math.round(getPreferredTemperature(currentData.days[i].feelslike))
        : "";
    const minTemp = Math.round(
      getPreferredTemperature(currentData.days[i].tempmin),
    );
    const maxTemp = Math.round(
      getPreferredTemperature(currentData.days[i].tempmax),
    );
    const isToday = i === 0;
    makeDayCard(
      date,
      icon,
      currentTemp,
      feelsLike,
      description,
      minTemp,
      maxTemp,
      isToday,
    );
  }
}

async function getWeather(search) {
  try {
    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search}/today?unitGroup=us&key=VEU7VHUPV9DAQN7553J54U9CB&contentType=json`,
      { mode: "cors" },
    );
    let json = await response.json();
    currentData = json;
    transformWeatherData();
  } catch (err) {
    console.log(err);
    if (search !== "") {
      alert(search + " not found");
    }
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (query.value === "") {
    return;
  }

  getWeather(query.value);
});
