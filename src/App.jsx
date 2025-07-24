import { useState, useEffect } from "react"
import dayjs from 'dayjs'


function App() {

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState([])
  const [forecast, setForecast] = useState([])

  const currentDate = dayjs().format('MMMM DD, h:ma')




  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({ latitude, longitude });

        const apiKey = '7057ad15720b1dffad3379309b846783';
        const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        try {
          const res = await fetch(api);
          const data = await res.json();

          const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,showers_sum&timezone=auto`)
          const forecastData = await forecastResponse.json()
          setForecast(forecastData)
          setWeather(data)

        } catch (err) {
          setError(`Failed to fetch weather: ${err.message}`);
        }
      },
      (err) => {
        setError(`Error: ${err.message}`);
      }
    );
  }, []);
  //console.log(weather)
  console.log(forecast)


  return (

    <>

      <div className="min-h-screen w-full bg-[#fff8f0] relative flex items-center justify-center p-4">
        
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(255, 182, 153, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 244, 214, 0.5) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(255, 182, 153, 0.1) 0%, transparent 50%)`,
          }}
        />

        {weather &&
          weather.name &&
          weather.sys &&
          weather.main.temp &&
          weather.main.feels_like &&
          weather.weather[0].description &&
          weather.weather[0].icon &&
          forecast.daily.time &&
          forecast.daily.temperature_2m_min &&
          forecast.daily.temperature_2m_max &&
          forecast.daily.weather_code
          ? (
            <div className="flex flex-col items-center gap-6 relative z-10 ">

              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 flex flex-col items-center gap-5 max-w-md w-full border border-[#ffd7ba]">

                <p className="text-sm text-gray-600">{currentDate}</p>


                <h1 className="text-2xl font-bold text-[#78350f]">
                  {weather.name}, {weather.sys.country}
                </h1>


                <div className="flex items-center gap-4">
                  <img
                    src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                    alt="weather icon"
                    className="w-16 h-16"
                  />
                  <p className="font-extrabold text-[#9a3412] text-4xl ">
                    {(weather.main.temp - 273.15).toFixed(1)}°C
                  </p>
                </div>

              
                <div className="text-center">
                  <p className="text-lg text-[#7c2d12]">
                    Feels like:{" "}
                    <span className="font-semibold">
                      {(Math.ceil(weather.main.feels_like - 273.15)).toFixed(1)}°C
                    </span>
                  </p>
                  <p className="capitalize text-[#92400e] mt-1 text-sm italic">
                    {weather.weather[0].description}
                  </p>
                </div>
              </div>
              <h1 className="text-2xl text-blue font-bold p-2 ">7-day Forecast</h1>
             
              <div className="flex flex-wrap justify-center gap-5 items-center">

                {forecast.daily.time.map((item, index) => {

                  const d = new Date(item);
                  const formattedDate = d.toLocaleDateString("en-PH", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });

                  const minTemp = forecast.daily.temperature_2m_min[index]
                  const maxTemp = forecast.daily.temperature_2m_max[index]

                  const weatherCode = forecast.daily.weather_code[index]
                  const wmoDescriptions = {
                    0: { desc: "Clear sky", icon: "☀️" },
                    1: { desc: "Mainly clear", icon: "🌤️" },
                    2: { desc: "Partly cloudy", icon: "⛅" },
                    3: { desc: "Overcast", icon: "☁️" },
                    45: { desc: "Fog", icon: "🌫️" },
                    48: { desc: "Depositing rime fog", icon: "🌫️" },
                    51: { desc: "Light drizzle", icon: "🌦️" },
                    53: { desc: "Moderate drizzle", icon: "🌧️" },
                    55: { desc: "Dense drizzle", icon: "🌧️" },
                    56: { desc: "Light freezing drizzle", icon: "🌧️❄️" },
                    57: { desc: "Dense freezing drizzle", icon: "🌧️❄️" },
                    61: { desc: "Slight rain", icon: "🌧️" },
                    63: { desc: "Moderate rain", icon: "🌧️" },
                    65: { desc: "Heavy rain", icon: "🌧️🌊" },
                    66: { desc: "Light freezing rain", icon: "🌧️❄️" },
                    67: { desc: "Heavy freezing rain", icon: "🌧️❄️" },
                    71: { desc: "Slight snow fall", icon: "🌨️" },
                    73: { desc: "Moderate snow fall", icon: "🌨️" },
                    75: { desc: "Heavy snow fall", icon: "❄️" },
                    77: { desc: "Snow grains", icon: "🌨️" },
                    80: { desc: "Rain showers", icon: "🌦️" },
                    81: { desc: "Moderate rain showers", icon: "🌧️" },
                    82: { desc: "Violent rain showers", icon: "🌧️⚡" },
                    85: { desc: "Slight snow showers", icon: "🌨️" },
                    86: { desc: "Heavy snow showers", icon: "❄️" },
                    95: { desc: "Thunderstorm", icon: "⛈️" },
                    96: { desc: "Thunderstorm with slight hail", icon: "⛈️🌨️" },
                    99: { desc: "Thunderstorm with heavy hail", icon: "⛈️🧊" }
                  };

                  return (
                    <div
                      key={index}
                      className="bg-white/60 backdrop-blur-md border border-[#ffd7ba] rounded-xl p-4 shadow-md w-32 sm:w-40 md:w-44 flex flex-col items-center justify-center text-center"
                    >
                      <p className="text-xs sm:text-sm text-[#78350f] font-medium mb-1">{formattedDate}</p>
                      <div className="text-3xl">{wmoDescriptions[weatherCode].icon}</div>
                      <p className="text-sm mt-1 text-[#92400e]">{wmoDescriptions[weatherCode].desc}</p>
                      <p className="mt-2 text-base font-semibold text-[#7c2d12]">
                        {minTemp.toFixed(0)}° / {maxTemp.toFixed(0)}°C
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="text-[#78350f] text-center z-10 mt-10 text-lg">Fetching data...</p>
          )}
      </div>
    </>
  )
}

export default App
