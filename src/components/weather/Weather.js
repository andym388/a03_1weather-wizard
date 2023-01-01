import { useState } from "react";
import "./Weather.scss";

const Weather = () => {
  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}: ${date} ${month}, ${year}`;
  };

  const apiKey = process.env.REACT_APP_API_KEY;
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(true);
  const [errorMsg, seterrorMsg] = useState("");

  const iconURL = "http://openweathermap.org/img/w/";

  const getInput = (event) => {
    setInput(event.target.value);
  };

  const getWeatherData = (event) => {
    if (event.key === "Enter" && input === "") {
      seterrorMsg("Input cannot be empty");
      setError(true);
    }
    if (event.key === "Enter" && input !== "") {
      setIsLoading(true);
      setError(true);
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&APPID=${apiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            throw Error("Failed to Fetch Data");
          }
          return response.json();
        })
        .then((data) => {
          setWeather(data);
          setInput("");
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
    <section className="weather-sec --100vh --center-all">
      <div className="container weather --flex-center">
        <div className="weather-wizard --text-light">
          <h1>Weather Wizard</h1>
          <div className="--text-p --fw-bold">{dateBuilder(new Date())}</div>
          <div className="--form-control --my2">
            <input
              type="text"
              placeholder="Search city name"
              onChange={getInput}
              value={input}
              onKeyDown={getWeatherData}
            />
          </div>
          {error ? (
            <p className={errorMsg !== "" ? "error" : ""}>{errorMsg}</p>
          ) : (
            <div className="result --card -m2">
              <h2>
                {weather.name}, {weather.sys.country}
              </h2>
              <div className="icon">
                <img
                  src={iconURL + weather.weather[0].icon + ".png"}
                  alt={weather.weather[0].main}
                />
              </div>
              <h3>Weather: {weather.weather[0].main}</h3>
              <h4>Temp: {Math.round(weather.main.temp)}ºC</h4>
              <p className="--fw-bold">
                Min: {Math.round(weather.main.temp_min)}ºC / Max:{" "}
                {Math.round(weather.main.temp_max)}ºC
              </p>
            </div>
          )}
          {isLoading && <h4>Loading...</h4>}
        </div>
      </div>
    </section>
  );
};

export default Weather;
