let activeCity = "Oslo";

let citySelector = document.getElementById("city-selector");
citySelector.addEventListener("change", function () {
    activeCity = citySelector.value;
    setActiveCity();
});

function setActiveCity() {
    let activeCityDisplay = document.getElementById("active-city");
    activeCityDisplay.innerHTML = activeCity;
    fetchWeather();
}
setActiveCity();

async function fetchWeather() {
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${activeCity}&appid=${apiKey}&units=metric`;
    try {
        let response = await fetch(url);
        let weatherData = await response.json();
        displayWeather(weatherData);
        fetchClosestForecast(activeCity, weatherData.sys.country, 5);
    } catch (error) {
        console.error("Error fetching weather data: ", error);
    }
}

function displayWeather(weatherData) {
    // MAIN WEATHER
    const iconContiner = document.getElementById("weather-icon");
    while (iconContiner.firstChild) {
        iconContiner.removeChild(iconContiner.lastChild);
    }
    applyIcon(weatherData.weather[0].icon, iconContiner, 4);

    const temp = weatherData.main.temp;
    document.getElementById("weather-temperature").innerHTML = `${temp} &#176;C`;

    const desc = weatherData.weather[0].description;
    document.getElementById("weather-description").innerHTML = desc;

    // ADDITIONAL WEATHER INFO
    let weatherdetailsContainer = document.getElementById("weatherdetails");
    while (weatherdetailsContainer.firstChild) {
        weatherdetailsContainer.removeChild(weatherdetailsContainer.lastChild);
    }
    const details = ["wind", "humidity", "pressure"];
    details.forEach((detail) => {
        console.log(detail);
        let detailElem = document.createElement("div");
        detailElem.className = "weather-detail card col text-center";
        detailElem.appendChild(document.createElement("b")).innerHTML =
            detail.charAt(0).toUpperCase() + detail.slice(1);
        weatherdetailsContainer.appendChild(detailElem);
    });

    //const wind = weatherData.wind.speed;
    //console.log(wind);
    //document.getElementById("weather-wind").innerHTML = `Wind: ${wind} meter/sec`;
}

async function fetchClosestForecast(activeCity, country, count) {
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast/?q=${activeCity},${country}&cnt=${count}&appid=${apiKey}&units=metric`;
    try {
        let response = await fetch(url);
        let weatherData = await response.json();
        displayClosestForecast(weatherData);
    } catch (error) {
        console.error("Error fetching weather data: ", error);
    }
}

function displayClosestForecast(weatherData) {
    const forcast = weatherData.list;
    const forecastContainer = document.getElementById("closestForecast");
    while (forecastContainer.firstChild) {
        forecastContainer.removeChild(forecastContainer.lastChild);
    }

    for (let i = 0; i < forcast.length; i++) {
        const data = forcast[i];

        let forecastElem = document.createElement("div");
        forecastElem.className = "forecastElem card col text-center";

        const timeElem = document.createElement("div");
        var match = data.dt_txt.match(/([0-9]{1,2}\:[0-9]{1,2})/);
        let text = match[1];
        timeElem.innerHTML = `${text}`;
        forecastElem.appendChild(timeElem);

        applyIcon(data.weather[0].icon, forecastElem, 2);

        const tempElem = document.createElement("div");
        text = Math.round(data.main.temp);
        tempElem.innerHTML = `${text} &#176;C`;
        forecastElem.appendChild(tempElem);

        forecastContainer.appendChild(forecastElem);
    }
}

function applyIcon(icon, output, size) {
    let img = document.createElement("img");
    img.src = `https://openweathermap.org/img/wn/${icon}@${size}x.png`;
    output.appendChild(img);
}
