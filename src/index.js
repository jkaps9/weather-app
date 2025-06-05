import "./styles.css";
import snowImage from "./images/cold.svg";
import rainImage from "./images/rain.svg";
import fogImage from "./images/fog.svg";
import windImage from "./images/wind.svg";
import cloudImage from "./images/cloudy.svg";
import partlyCloudyImage from "./images/partly-cloudy-day.svg";
import partlyCloudyNightImage from "./images/partly-cloudy-night.svg";
import clearDayImage from "./images/clear-day.svg";
import clearNightImage from "./images/clear-night.svg";

const loc = document.querySelector("#location");
const weatherData = document.querySelector("#weather-data");

const icons = {
  snow: snowImage,
  rain: rainImage,
  fog: fogImage,
  wind: windImage,
  cloudy: cloudImage,
  "partly-cloudy-day": partlyCloudyImage,
  "partly-cloudy-night": partlyCloudyNightImage,
  "clear-day": clearDayImage,
  "clear-night": clearNightImage,
};

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
  weatherIcon.src = icons[icon];
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

function getWeather() {
  // const query = search.value;
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/New%20York%2C%20NY/today?unitGroup=us&key=VEU7VHUPV9DAQN7553J54U9CB&contentType=json`,
    { mode: "cors" },
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      loc.textContent = response.address;

      for (let i = 0; i < response.days.length; i++) {
        const date = new Date(response.days[i].datetime).toLocaleDateString(
          "en-US",
        );
        const icon = response.days[i].icon;
        const description = i === 0 ? response.days[i].description : "";
        const currentTemp = Math.round(response.days[i].temp);
        const feelsLike = i === 0 ? Math.round(response.days[i].feelslike) : "";
        const minTemp = Math.round(response.days[i].tempmin);
        const maxTemp = Math.round(response.days[i].tempmax);
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
    })
    .catch(function (e) {
      console.log(e);
    });
}

function transformWeatherData(jsonResponse) {
  loc.textContent = jsonResponse.address;

  for (let i = 0; i < jsonResponse.days.length; i++) {
    const date = new Date(jsonResponse.days[i].datetime).toLocaleDateString(
      "en-US",
    );
    const icon = jsonResponse.days[i].icon;
    const description = i === 0 ? jsonResponse.days[i].description : "";
    const currentTemp = Math.round(jsonResponse.days[i].temp);
    const feelsLike = i === 0 ? Math.round(jsonResponse.days[i].feelslike) : "";
    const minTemp = Math.round(jsonResponse.days[i].tempmin);
    const maxTemp = Math.round(jsonResponse.days[i].tempmax);
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

async function asyncGetWeather() {
  try {
    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/New%20York%2C%20NY/today?unitGroup=us&key=VEU7VHUPV9DAQN7553J54U9CB&contentType=json`,
      { mode: "cors" },
    );
    let json = await response.json();
    transformWeatherData(json);
  } catch (err) {
    console.log(err);
  }
}

asyncGetWeather();
