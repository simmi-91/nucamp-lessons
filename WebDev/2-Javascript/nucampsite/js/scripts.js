async function fetchWeather() {
    const apiKey = process.env.OPEN_WEATHER_API_KEY;
    const city = "Oslo";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        let response = await fetch(url);
        let weatherData = await response.json();
        displayWeather(weatherData);
    } catch (error) {
        console.error("Error fetching weather data: ", error);
    }
}

function displayWeather(weatherData) {
    const icon = weatherData.weather[0].icon;
    let img = document.createElement("img");
    img.src = `https://openweathermap.org/img/w/${icon}.png`;
    let imgContainer = document.getElementById("weather-icon");
    imgContainer.appendChild(img);

    const temp = weatherData.main.temp;
    let tempContainer = document.getElementById("weather-temp");
    tempContainer.innerHTML = `${temp} &#176;C`;

    const desc = weatherData.weather[0].description;
    let descContainer = document.getElementById("weather-description");
    descContainer.innerHTML = desc;

    const wind = weatherData.wind.speed;
    let windContainer = document.getElementById("weather-wind");
    windContainer.innerHTML = `Wind: ${wind} meter/sec`;
}
fetchWeather();
