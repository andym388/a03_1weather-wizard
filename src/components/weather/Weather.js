/* Weather Component contains the Application Logic to:
   - fetch the weather data from browser via an API call
   - display an error message when weather data cannot be fetch
   - display an interim message when data loading is occurring
   - display a warm weather background when temperature is above 15ºC
   - format and display the weather data using scss and css files
*/
import { useState } from "react";
import "./Weather.scss";
import { FaSearchLocation } from "react-icons/fa";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(true);
  const [errorMsg, seterrorMsg] = useState("");

  const apiKey = process.env.REACT_APP_API_KEY;
  const apiURL = "https://api.openweathermap.org/data/2.5/";
  const iconURL = "https://openweathermap.org/img/w/";

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(city);
    getWeatherData();
  };

  const getWeatherData = () => {
    if (city === "") {
      seterrorMsg("City cannot be empty");
      setError(true);
    }
    if (city !== "") {
      setIsLoading(true);
      setError(true);
      fetch(`${apiURL}weather?appid=${apiKey}&q=${city}&units=metric`)
        .then((response) => {
          if (!response.ok) {
            throw Error("Failed to Fetch Data");
          }
          return response.json();
        })
        .then((data) => {
          setWeather(data);
          console.log(data);
          setCity("");
          setError(false);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setError(true);
          seterrorMsg(err.message);
          setIsLoading(false);
        });
    }
  };

  return (
    <section className="section --center-all weather-section">
      <h2 className="--fw-bold --text-light">Weather Wizard</h2>
      <div
        className={
          weather.main !== undefined
            ? weather.main.temp > 15
              ? "container --flex-center weather warm"
              : "container --flex-center weather"
            : "container --flex-center weather"
        }
      >
        <div className="weather-fieldset">
          <form onSubmit={submitHandler} className="--form-control">
            <div>
              <input
                type="text"
                placeholder="Enter City ..."
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
              &nbsp;
              <button onClick={submitHandler} className="--bg-grey">
                <FaSearchLocation />
                &nbsp;Search
              </button>
            </div>
          </form>
          {error ? (
            <p className={errorMsg !== "" ? "error" : ""}>{errorMsg}</p>
          ) : (
            <div className="result --card -m2">
              <br />
              <h3>
                {weather.name}, {weather.sys.country}
              </h3>
              <div className="--text-p --fw-bold">
                {Date(weather.dt * 1000 - weather.timezone * 1000)}
              </div>
              <div className="icon">
                <img
                  src={iconURL + weather.weather[0].icon + ".png"}
                  alt={weather.weather[0].main}
                />
              </div>
              <h4>Weather: {weather.weather[0].description}</h4>
              <p className="--fw-bold">Cloud coverage: {weather.clouds.all}%</p>
              <p className="--fw-bold">
                Temp: {Math.round(weather.main.temp)}ºC
              </p>
              <p className="--fw-bold">
                Min: {Math.round(weather.main.temp_min)}ºC / Max:{" "}
                {Math.round(weather.main.temp_max)}ºC
              </p>
              <p className="--fw-bold">
                Visibility: {weather.visibility} meters
              </p>
              <p className="--fw-bold">
                Humidity: {weather.main.humidity} g.m-3
              </p>
              <p className="--fw-bold">
                Wind: {Math.round(weather.wind.speed)} km/h
              </p>
              <p className="--fw-bold">
                Pressure: {weather.main.pressure} N·m−2
              </p>
              <br />
            </div>
          )}
          {isLoading && <h4>Loading...</h4>}
        </div>
      </div>
    </section>
  );
};

export default Weather;
