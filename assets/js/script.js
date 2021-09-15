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