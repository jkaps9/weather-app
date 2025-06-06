import "./styles.css";
import getIcon from "./imageLoader";
import { fahrenheitToCelsius } from "./tempconverter";

const loc = document.querySelector("#location");
const weatherData = document.querySelector("#weather-data");
const form = document.querySelector("form");
const query = document.querySelector("#search");
const tempPreference = "celsius";

function getPreferredTemperature(temperatureInFahrenheit) {
  if (tempPreference === "fahrenheit") {
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

function transformWeatherData(jsonResponse) {
  loc.textContent = jsonResponse.resolvedAddress;

  for (let i = 0; i < jsonResponse.days.length; i++) {
    const date = new Date(jsonResponse.days[i].datetime).toLocaleDateString(
      "en-US",
    );
    const icon = jsonResponse.days[i].icon;
    const description = i === 0 ? jsonResponse.days[i].description : "";
    const currentTemp = Math.round(
      getPreferredTemperature(jsonResponse.days[i].temp),
    );
    const feelsLike =
      i === 0
        ? Math.round(getPreferredTemperature(jsonResponse.days[i].feelslike))
        : "";
    const minTemp = Math.round(
      getPreferredTemperature(jsonResponse.days[i].tempmin),
    );
    const maxTemp = Math.round(
      getPreferredTemperature(jsonResponse.days[i].tempmax),
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
    removeAllChildren(weatherData);
    transformWeatherData(json);
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
