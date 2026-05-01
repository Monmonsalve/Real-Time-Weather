import './App.css';
import { useEffect, useState } from "react";

function App() {
const [location, setLocation] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by your browser");
    return;
  }
  //Seach for the user's location
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

        setLocation({
          latitude: lat,
          longitude: lon,
          city,
          country,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to get location details");}},
    (err) => {
      setError(err.message);});}, []);

    return (
      <div className="App">
        <header className="App-header">
          <h1>Real Time Weather App</h1>
        </header>
        <div>
          {error && <p>Error: {error}</p>}
          {/* 🌍 Loader animation */}
          {!location && !error ? (
            <div className="loader-container">
              <div className="globe" />
              <p>Search Your Country...</p>
            </div>
          ) : location ?(
            <div>
              <p>City: {location.city}</p>
              <p>Country: {location.country}</p>
            </div>
          ): (
            <p>Unable to retrieve location.</p>
          )}
        </div>
      </div>
    );
}

export default App;
