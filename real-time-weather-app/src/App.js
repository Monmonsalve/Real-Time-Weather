import './App.css';
import { useEffect, useState } from "react";
import World_animation from './views/world';
import Weather from './views/weather';

function App() {
const [location, setLocation] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );

        const data = await response.json();

        const city = data.city || "Unknown city";
        const country = data.countryName || "Unknown country";
        const countryCode = data.countryCode?.toLowerCase() || "";

        setLocation({
          city,
          country,
          countryCode
        });

      } catch (err) {
        console.error(err);
        setError("Failed to get location details");
      }
    },
    (err) => {
      setError(err.message);
    }
  );
}, []);

return (
  <div className="App">

    <header className="App-header">
    <h1>Time and Weather</h1>
    <h2>Tu Pais</h2>
    {location?.countryCode && (
      <img
        src={`https://flagcdn.com/w80/${location.countryCode}.png`}
        alt="flag"
      />
    )}
  </header>

    <div>
      {error && <p>Error: {error}</p>}

      {!location && !error ? (
        <World_animation />
      ) : location ? (
        <Weather
          city={location.city}
          country={location.country}
          countryCode={location.countryCode}
        />
      ) : (
        <p>Unable to retrieve location.</p>
      )}
    </div>

  </div>
);
}

export default App;