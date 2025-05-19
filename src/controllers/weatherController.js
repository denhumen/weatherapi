const axios = require('axios');

exports.getWeather = async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'WEATHER_API_KEY not configured' });
  }

  try {
    const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
      params: { key: apiKey, q: city, aqi: 'no' }
    });
    const curr = response.data.current;
    return res.json({
      temperature: curr.temp_c,
      humidity:    curr.humidity,
      description: curr.condition.text
    });
  } catch (err) {
    console.error('WeatherAPI fetch error:', err.message);
    if (err.response) {
      return res
        .status(err.response.status)
        .json({ message: err.response.data?.error?.message || 'WeatherAPI error' });
    }
    return res.status(502).json({ message: 'Unable to fetch weather data' });
  }
};
