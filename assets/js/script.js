var searchHistoryItems = document.getElementById("search-history-items");
var currentWeatherCity = document.getElementById("current-weather-city");
var currentWeatherData = document.getElementById("current-weather");
var forecastEl = document.getElementById("forecast");
var clearHistory = document.getElementById("clear-btn");
var searchInput = document.getElementById("search-input");
var searchButton = document.getElementById("search-button");
var confirmLocationModal = document.getElementById("confirm-location-modal");

var searchTerms = [];
var searchHistory = [];
var displayName;

var getCoordinates = function (searchTerm) {
    searchTerm = searchTerm.split(" ").join("+");
    var geocodingApiUrl =
      "https://www.mapquestapi.com/geocoding/v1/address?key=MxMEt0lAXnEnzLPH7q3pPeMkwmaa422h&location=" +
      searchTerm;
    fetch(geocodingApiUrl).then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          var locations = data.results[0].locations;
          if (locations.length == 1) {
            saveLocation(locations[0]);
            getWeather(locations[0].latLng);
          } else {
            confirmLocation(locations);
          }
        });
      } else {
        console.log("Couldn't get the coordinates from the map API: ", res.text);
      }
    });
  };

var getCoordinates = function (searchTerm) {
    searchTerm = searchTerm.split(" ").join("+");
    var geocodingApiUrl =
      "https://www.mapquestapi.com/geocoding/v1/address?key=MxMEt0lAXnEnzLPH7q3pPeMkwmaa422h&location=" +
      searchTerm;
    fetch(geocodingApiUrl).then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          var locations = data.results[0].locations;
          if (locations.length == 1) {
            saveLocation(locations[0]);
            getWeather(locations[0].latLng);
          } else {
            confirmLocation(locations);
          }
        });
      } else {
        console.log("Couldn't get the coordinates from the map API: ", res.text);
      }
    });
  };

var getWeather = function (coords) {
    var weatherApiUrl =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      coords.lat +
      "&lon=" +
      coords.lng +
      "&units=imperial&exclude=minutely,hourly&appid=f01c0425c991377d624e271e69ef329d";
    fetch(weatherApiUrl).then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          displayWeather(data);
        });
      } else {
        console.log(
          "Couldn't get the weather data from the openweathermap API: ",
          res.text
        );
      }
    });
  };

  var displayIcon = function (iconElement, iconCode, iconAlt) {
    var iconSrc = "https://openweathermap.org/img/w/" + iconCode + ".png";
    iconElement.setAttribute("src", iconSrc);
    iconElement.setAttribute("alt", iconAlt);
  };
  
  var displayWeather = function (weatherData) {
    currentWeatherCity.textContent = displayName;
  
    var dateElement = currentWeatherData.querySelector("#current-weather-date");
    var unixDate = weatherData.current.dt;
    var formattedDate = moment.unix(unixDate).format("dddd, MMMM Do");
    dateElement.textContent = formattedDate;
  
    var iconElement = currentWeatherData.querySelector("#current-weather-icon");
    var iconCode = weatherData.current.weather[0].icon;
    var iconAlt = weatherData.current.weather[0].description + " icon";
    displayIcon(iconElement, iconCode, iconAlt);
  
    var humidityElement = currentWeatherData.querySelector(
      "#current-weather-humidity"
    );
    var humidity = weatherData.current.humidity; // percentage
    humidityElement.textContent = "Humidity: " + humidity + "%";
  
    var temperatureElement = currentWeatherData.querySelector(
      "#current-weather-current-temp"
    );
    var temperature = Math.floor(weatherData.current.temp);
    temperatureElement.textContent = "Current Temperature: " + temperature + "°F";
  
    var minTempElement = currentWeatherData.querySelector(
      "#current-weather-min-temp"
    );
    var minTemp = Math.floor(weatherData.daily[0].temp.min);
    minTempElement.textContent = "Low: " + minTemp + "°F";
  
    var maxTempElement = currentWeatherData.querySelector(
      "#current-weather-max-temp"
    );
    var maxTemp = Math.floor(weatherData.daily[0].temp.max);
    maxTempElement.textContent = "High: " + maxTemp + "°F";
  
    var windSpeedElement = currentWeatherData.querySelector(
      "#current-weather-wind-speed"
    );
    var windSpeed = weatherData.current.wind_speed;
    windSpeedElement.textContent = "Wind Speed: " + windSpeed + " miles per hour";
  
    var uvIndexElement = currentWeatherData.querySelector(
      "#current-weather-uv-index"
    );
    uvIndexElement.innerHTML = "";
    uvIndexElement.textContent = "UV Index: ";
  
    var uvIndexSpan = document.createElement("span");
    var uvIndex = weatherData.current.uvi;
    uvIndexSpan.textContent = uvIndex;
  
    if (uvIndex >= 8) {
      uvIndexSpan.classList.add("uk-text-danger");
    } else if (uvIndex >= 3) {
      uvIndexSpan.classList.add("uk-text-warning");
    } else {
      uvIndexSpan.classList.add("uk-text-success");
    }
    uvIndexElement.appendChild(uvIndexSpan);
  
    var weatherPanel = document.querySelector("#weather-panel");
    var currentWeatherContainer = document.querySelector(
      "#current-weather-container"
    );
    weatherPanel.style.display = "block";
    currentWeatherContainer.style.display = "block";
  
    displayForecast(weatherData.daily);
  };
  
  var displayForecast = function (forecastData) {
    for (var i = 1; i < 6; i++) {
      var dateElement = forecastEl.querySelector("#forecast-date-" + i);
      var unixDate = forecastData[i].dt;
      dateElement.textContent = moment.unix(unixDate).format("MMMM Do");
  
      var iconElement = forecastEl.querySelector("#forecast-icon-" + i);
      var iconCode = forecastData[i].weather[0].icon;
      var iconAlt = forecastData[i].weather[0].description;
      displayIcon(iconElement, iconCode, iconAlt);
  
      var humidityElement = forecastEl.querySelector("#forecast-humidity-" + i);
      var humidity = forecastData[i].humidity;
      humidityElement.textContent = "Humidity: " + humidity + "%";
  
      var minTempElement = forecastEl.querySelector("#forecast-min-temp-" + i);
      var minTemp = Math.floor(forecastData[i].temp.min);
      minTempElement.textContent = "Low: " + minTemp + "°F";
      var maxTempElement = forecastEl.querySelector("#forecast-max-temp-" + i);
      var maxTemp = Math.floor(forecastData[i].temp.max);
      maxTempElement.textContent = "High: " + maxTemp + "°F";
    }
  
    var forecastContainer = document.querySelector("#weather-forecast-container");
    forecastContainer.style.display = "block";
  };
  
  var searchButtonHandler = function (event) {
    event.preventDefault();
    confirmLocationModal
      .querySelector("#confirm-location-form-message")
      .classList.remove("uk-text-primary");
    var searchValue = searchInput.value;
    if (searchValue) {
      getCoordinates(searchValue);
      searchInput.value = "";
    }
  };
  
  var searchHistoryHandler = function (event) {
    if (event.target.classList.contains("search-history-item")) {
      var searchedCity = event.target.getAttribute("data-location-name");
      getCoordinates(searchedCity);
    }
  };
  var confirmLocationHandler = function (event) {
    event.preventDefault();
    var confirmedLocation;
    var radioButtons = document.getElementsByName("search-result");
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        confirmedLocation = JSON.parse(
          radioButtons[i].getAttribute("data-location")
        );
      }
    }
  
    if (confirmedLocation) {
      UIkit.modal("#confirm-location-modal").hide();
      saveLocation(confirmedLocation);
      getWeather(confirmedLocation.latLng);
      confirmLocationModal
        .querySelector("#confirm-location-form-message")
        .classList.remove("uk-text-primary");
    } else {
      confirmLocationModal
        .querySelector("#confirm-location-form-message")
        .classList.add("uk-text-primary");
    }
  };
  
  function clearHistoryEl(event) {
    event.preventDefault();
    window.localStorage.clear();
    location.reload();
  }
  
  displaySearchHistory();
  searchButton.addEventListener("click", searchButtonHandler);
  searchHistoryItems.addEventListener("click", searchHistoryHandler);
  confirmLocationModal.addEventListener("submit", confirmLocationHandler);
  clearHistory.addEventListener("click", clearHistoryEl);