import "../css/weatherAndTime.css";
import { useEffect, useState } from "react";

import {
  WiDaySunny,
  WiNightClear,
  WiNightCloudy,
  WiCloud,
  WiFog,
  WiRain,
  WiSnow,
  WiThunderstorm
} from "react-icons/wi";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  // 🌟 LOADING STATE
  const [loadingIndex, setLoadingIndex] = useState(0);

  const loadingSteps = [
    "Obteniendo clima...",
    "Analizando cielo...",
    "Procesando datos...",
    "Preparando pronóstico..."
  ];

  const loadingIcons = [
    "🌍",
    "🌤️",
    "⛅",
    "🌧️",
    "🌩️",
    "📡"
  ];

  // 🔄 animación loading
  useEffect(() => {
    if (weather) return;

    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [weather]);

  // 🌤️ iconos con día/noche
  const getWeatherIcon = (code, isDay) => {
    switch (true) {
      case code === 0:
        return isDay
          ? <WiDaySunny size={36} />
          : <WiNightClear size={36} />;

      case code === 1:
      case code === 2:
        return isDay
          ? <WiDaySunny size={36} />
          : <WiNightCloudy size={36} />;

      case code === 3:
        return <WiCloud size={36} />;

      case code === 45:
      case code === 48:
        return <WiFog size={36} />;

      case code >= 51 && code <= 65:
        return <WiRain size={36} />;

      case code >= 71 && code <= 75:
        return <WiSnow size={36} />;

      case code >= 95:
        return <WiThunderstorm size={36} />;

      default:
        return <WiCloud size={36} />;
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
          );

          if (!response.ok) throw new Error("Error al obtener clima");

          const data = await response.json();

          setWeather({
            temp: data.current_weather.temperature,
            code: data.current_weather.weathercode,
            isDay: data.current_weather.is_day,
          });

          const forecastArray = data.daily.time.map((date, index) => ({
            date,
            max: data.daily.temperature_2m_max[index],
            min: data.daily.temperature_2m_min[index],
            code: data.daily.weathercode[index],
          }));

          setForecast(forecastArray);

        } catch (err) {
          console.error(err);
          setError("No se pudo obtener el clima");
        }
      },
      () => setError("Permiso de ubicación denegado")
    );
  }, []);

  // ❌ ERROR
  if (error) return <p>{error}</p>;

  // 🌤️ APP NORMAL
  return (
  <div className="weather-container">

    {/* ⏳ LOADING OVERLAY */}
    {!weather && (
      <div className="loading-overlay">

        <div className="loading-icon">
          {loadingIcons[loadingIndex]}
        </div>

        <h1 className="loading-text">
          Consiguiendo resultados de clima...
        </h1>

      </div>
    )}

    {/* 🌤️ CONTENIDO */}
    {weather && (
      <>
        <h2>Weather Now</h2>

        <div className="current-weather">
          {getWeatherIcon(weather.code, weather.isDay)}
          <p>{weather.temp}°C</p>
        </div>

        <h3>Next Days</h3>

        <div className="forecast">
          {forecast.map((day, index) => (
            <div key={index} className="weather-card">

              <p className="card-day">
                {new Date(day.date).toLocaleDateString("es-ES", {
                  weekday: "long"
                })}
              </p>

              <div className="card-weather">
                {getWeatherIcon(day.code, true)}
                <span>Max: {day.max}° / Min: {day.min}°</span>
              </div>

            </div>
          ))}
        </div>
      </>
    )}

  </div>
);}


export default Weather;