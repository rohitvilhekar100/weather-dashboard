const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const OPENWEATHER_KEY = '21a6874536092db1fe586ca83f094e7c';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <form method="POST" action="/weather">
            <input name="city" placeholder="Enter city" required />
            <button type="submit">Get Weather</button>
        </form>
    `);
});

app.post('/weather', async(req, res) => {
    const city = req.body.city;

    if (!city) {
        return res.send(`<p>Please enter a city!</p><a href="/">Back</a>`);
    }

    try {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_KEY}`;
        const weatherResponse = await axios.get(weatherURL);
        const data = weatherResponse.data;

        const weatherData = {
            temp: data.main.temp,
            humidity: data.main.humidity,
            description: data.weather[0].description
        };

        const analysisResponse = await axios.post('http://localhost:5000/api/analyze', weatherData);
        const { temp_f, suggestion } = analysisResponse.data;

        res.send(`
            <h2>Weather in ${city}</h2>
            <p>${weatherData.description}</p>
            <p>Temperature: ${weatherData.temp}°C / ${temp_f}°F</p>
            <p>Humidity: ${weatherData.humidity}%</p>
            <p><strong>${suggestion}</strong></p>
            <br><a href="/">Check another city</a>
        `);
    } catch (error) {
        let errorMsg = 'Something went wrong.';

        if (error.response && error.response.status === 401) {
            errorMsg = 'Invalid API key. Please check your OpenWeather API key.';
        } else if (error.response && error.response.status === 404) {
            errorMsg = 'City not found. Try another one.';
        }

        console.error(error.message);
        res.send(`<p>Error: ${errorMsg}</p><a href="/">Back</a>`);
    }
});

app.listen(PORT, () => {
    console.log(`Frontend running on http://localhost:${PORT}`);
});