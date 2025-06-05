import "./styles.css";

const loc = document.querySelector("#location");
const weatherData = document.querySelector("#weather-data");

const icons = {
  snow: "./images/snow.svg",
  rain: "./images/rain.svg",
  fog: "./images/fog.svg",
  wind: "./images/wind.svg",
  cloudy: "./images/cloudy.svg",
  "partly-cloudy-day": "./images/partly-cloudy-day.svg",
  "partly-cloudy-night": "./images/partly-cloudy-night.svg",
  "clear-day": "./images/clear-day.svg",
  "clear-night": "./images/clear-night.svg",
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

  const datePara = document.createElement("p");
  datePara.classList.add("date");
  datePara.textContent = date;
  card.appendChild(datePara);

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
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Pearl%20River%2C%20NY/today?unitGroup=us&key=VEU7VHUPV9DAQN7553J54U9CB&contentType=json`,
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
getWeather();
