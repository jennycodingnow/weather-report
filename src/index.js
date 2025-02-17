'use strict';

const state = {
  city: 'Honolulu',
  temperature: 70,
  lat: 21.315603,
  lon: -157.858,
};

const updateTempLabel = () => {
  const tempLabel = document.getElementById('tempLabel');
  tempLabel.textContent = `${state.temperature}°F`;
  const changeLandscape = document.getElementById('landscape');

  let landscape = '🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷';
  if (state.temperature >= 80) {
    tempLabel.className = 'red';
    landscape = '🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂';
  } else if (state.temperature >= 70) {
    tempLabel.className = 'orange';
    landscape = '🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷';
  } else if (state.temperature >= 60) {
    tempLabel.className = 'yellow';
    landscape = '🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃';
  } else if (state.temperature >= 50) {
    tempLabel.className = 'green';
    landscape = '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲';
  } else if (state.temperature <= 49) {
    tempLabel.className = 'teal';
    landscape = '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲';
  }
  console.log(tempLabel.className);
  changeLandscape.textContent = `${landscape}`;
};

const increaseTemp = () => {
  state.temperature += 1;
  updateTempLabel();
  console.log('increase temp');
};

const decreaseTemp = () => {
  state.temperature -= 1;
  updateTempLabel();
  console.log('decrease temp');
};

const updateCityLabel = () => {
  const citySearch = document.getElementById('cityLabel');
  citySearch.textContent = `${state.city}`;
};

const updateCityWithTemp = () => {
  updateCity();
  getLatAndLong();
};

const updateCity = () => {
  const searchFieldInput = document.getElementById('citySearch');
  state.city = searchFieldInput.value;
  updateCityLabel();
};

const updateTheSky = () => {
  const skyLabel = document.querySelector('#sky-types').value;
  const changeSky = document.getElementById('sky-horizon');

  const imageElement = document.querySelector('#sunnyday');

  let sky = '☁️ ☁️ ☁️🌞☁️ ☁️ ☁️';
  if (skyLabel === 'sunny') {
    sky = '☁️ ☁️ ☁️🌞☁️ ☁️ ☁️';
    imageElement.src = '../ada-project-docs/images/sunnyday.jpg';
  } else if (skyLabel === 'cloudy') {
    sky = '☁️☁️ ☁️ ☁️☁️ ☁️ 🌤 ☁️ ☁️☁️';
    imageElement.src = '../ada-project-docs/images/cloudyday.jpg';
  } else if (skyLabel === 'rainy') {
    sky = '🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧';
    imageElement.src = '../ada-project-docs/images/rainyday.jpg';
  } else if (skyLabel === 'snowy') {
    sky = '🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨';
    imageElement.src = '../ada-project-docs/images/winterday.jpg';
  }
  changeSky.textContent = `${sky}`;
};

const resetCity = () => {
  const cityName = document.getElementById('citySearch');
  cityName.value = '';
  state.city = 'Honolulu';
  updateCityLabel();

  const skyHorizon = document.getElementById('sky-horizon');
  skyHorizon.textContent = '☁️ ☁️ ☁️🌞☁️ ☁️ ☁️';
};

const registerEventHandlers = () => {
  const tempUpButton = document.getElementById('tempUp');
  tempUpButton.addEventListener('click', increaseTemp);
  const tempDownButton = document.getElementById('tempDown');
  tempDownButton.addEventListener('click', decreaseTemp);
  const submitCityButton = document.getElementById('submitCity');
  submitCityButton.addEventListener('click', updateCityWithTemp);
  const selectItem = document.getElementById('sky-types');
  selectItem.addEventListener('change', updateTheSky);
  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', resetCity);
  const citySearchEl = document.getElementById('citySearch');
  citySearchEl.addEventListener('input', updateCity);
};

document.addEventListener('DOMContentLoaded', registerEventHandlers);

const getLatAndLong = () => {
  axios
    .get('http://localhost:5000/location', {
      params: {
        q: state.city,
      },
    })
    .then((response) => {
      state.lat = response.data[0]['lat'];
      state.lon = response.data[0]['lon'];
      getRealTimeWeather();
    })
    .catch((error) => {
      console.log('Error finding latitude and longitude,', error);
    });
};

const getRealTimeWeather = () => {
  axios
    .get('http://localhost:5000/weather', {
      params: {
        lat: state.lat,
        lon: state.lon,
      },
    })
    .then((response) => {
      let tempInKelvin = response.data.current.temp;
      let realTimeWeather = Math.floor((tempInKelvin - 273.15) * (9 / 5) + 32);
      state.temperature = realTimeWeather;
      updateTempLabel();
    })
    .catch((error) => {
      console.log(`Error in real time weather: ${error}`);
    });
};
