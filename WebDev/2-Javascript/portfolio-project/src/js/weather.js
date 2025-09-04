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
    const iconContainer = document.getElementById("weather-icon");
    while (iconContainer.firstChild) {
        iconContainer.removeChild(iconContainer.lastChild);
    }
    applyIcon(weatherData.weather[0].icon, iconContainer, 4);

    const temp = Math.round(weatherData.main.temp * 10) / 10;
    document.getElementById("weather-temperature").innerHTML = `${temp}&#176;C`;

    const desc = weatherData.weather[0].description;
    const feel = Math.round(weatherData.main.feels_like * 10) / 10;

    let descriptionContainer = document.getElementById("weather-description");
    while (descriptionContainer.firstChild) {
        descriptionContainer.removeChild(descriptionContainer.lastChild);
    }
    descriptionContainer.appendChild(textElem("p", `${desc}, feels like ${feel}&#176;C`));

    console.log(weatherData);

    // ADDITIONAL WEATHER INFO
    let weatherdetailsContainer = document.getElementById("weatherdetails");
    while (weatherdetailsContainer.firstChild) {
        weatherdetailsContainer.removeChild(weatherdetailsContainer.lastChild);
    }
    const details = ["wind", "humidity", "pressure"];
    details.forEach((detail) => {
        let detailElem = document.createElement("span");
        detailElem.className = "d-flex";
        //detailElem.className = "weather-detail card col text-center";
        //detailElem.appendChild(document.createElement("b")).innerHTML = detail.charAt(0).toUpperCase() + detail.slice(1);

        let numberElem = document.createElement("span");
        detailElem.className = "";

        numberElem.appendChild(document.createElement("b")).innerHTML =
            detail.charAt(0).toUpperCase() + detail.slice(1) + ": ";
        if (detail === "wind") {
            const dir = getWindDirection(weatherData.wind.deg);

            let arrow = document.createElement("img");
            arrow.src = "src/assets/images/arrow.svg";
            arrow.style.width = "15px";
            arrow.style.transform = `rotate(${weatherData.wind.deg}deg)`;
            arrow.setAttribute("title", `Wind Direction is ${dir}`);

            let windElem = document.createElement("span");
            windElem.appendChild(textElem("span", `${weatherData.wind.speed} m/s`, "mx-1"));
            windElem.appendChild(arrow);
            numberElem.appendChild(windElem);

            if (weatherData.wind.gust) {
                numberElem.appendChild(
                    textElem("span", `(${weatherData.wind.gust} gust)`, "mx-1 d-none d-lg-inline")
                );
            }
        } else if (detail === "humidity") {
            numberElem.appendChild(textElem("span", `${weatherData.main.humidity}%`));
        } else if (detail === "pressure") {
            numberElem.appendChild(textElem("span", `${weatherData.main.pressure}%`));
        }
        detailElem.appendChild(numberElem);

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

function textElem(elem, text, classes) {
    var newElem = document.createElement(elem);
    newElem.innerHTML = text;
    if (classes) {
        newElem.className = classes;
    }
    return newElem;
}

function getWindDirection(degrees) {
    const shortDir = [
        "N",
        "NNE",
        "NE",
        "ENE",
        "E",
        "ESE",
        "SE",
        "SSE",
        "S",
        "SSW",
        "SW",
        "WSW",
        "W",
        "WNW",
        "NW",
        "NNW",
    ];
    const directions = [
        "North",
        "North-Northeast",
        "Northeast",
        "East-Northeast",
        "East",
        "East-Southeast",
        "Southeast",
        "South-Southeast",
        "South",
        "South-Southwest",
        "Southwest",
        "West-Southwest",
        "West",
        "West-Northwest",
        "Northwest",
        "North-Northwest",
    ];

    // Ensure degrees are within 0-360
    degrees = ((degrees % 360) + 360) % 360;

    // Adjust for the starting point of North (centered around 0/360)
    degrees += 11.25;

    // Calculate the index for the directions array
    const index = Math.floor(degrees / 22.5);

    return directions[index];
}
