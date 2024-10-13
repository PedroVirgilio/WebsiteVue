<template>
    <div class="weather-app">
        <h2>Weather in {{ location }}</h2>
        <div v-if="error">{{ error }}</div>
        <div v-else>
            <div v-if="weather">
                <p>Temperature: {{ weather.main.temp }}°C</p>
                <p>Humidity: {{ weather.main.humidity }}%</p>
                <p>Description: {{ weather.weather[0].description }}</p>
                <p>Forecast for Today and Tomorrow:</p>
                <ul>
                    <li v-for="(item, index) in filteredForecast" :key="index">
                        {{ item.dt_txt }}: {{ item.main.temp }}°C, {{ item.weather[0].description }}
                    </li>
                </ul>
            </div>
        </div>
        <button @click="fetchWeather" :disabled="loading">
            <span v-if="loading">Refreshing...</span>
            <span v-else>Refresh</span>
        </button>
        <button @click="goBack">Return</button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { isToday, isTomorrow } from 'date-fns';
import { useRouter } from 'vue-router';


const location = ref('Your Location');
const weather = ref(null);
const forecast = ref(null);
const error = ref(null);
const loading = ref(false); // Loading state
const apiKey = '73423e2869786d72f8332d6d6b79d737';
const lat = ref(null);
const lon = ref(null);
const router = useRouter();

const fetchWeather = async () => {
    try {
        loading.value = true; // Start loading
        error.value = null;

        // Fetch current weather and forecast data
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat.value}&lon=${lon.value}&units=metric&appid=${apiKey}`);
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat.value}&lon=${lon.value}&units=metric&appid=${apiKey}`);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        weather.value = await weatherResponse.json();
        forecast.value = await forecastResponse.json();

        // Set location name (city)
        location.value = weather.value.name;

        console.log('Weather Response:', weather.value);
        console.log('Forecast Response:', forecast.value);
    } catch (err) {
        error.value = err.message;
        console.error("Error fetching weather data:", err);
    } finally {
        loading.value = false; // End loading
    }
};

// Filter forecast to show only today's and tomorrow's data
const filteredForecast = computed(() => {
    if (!forecast.value) return [];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return forecast.value.list.filter(item => {
        const itemDate = new Date(item.dt_txt);
        return isToday(itemDate) || isTomorrow(itemDate);
    });
});

// Fetch user location
navigator.geolocation.getCurrentPosition((position) => {
    lat.value = position.coords.latitude;
    lon.value = position.coords.longitude;
    fetchWeather(); // Fetch weather after getting location
}, (error) => {
    console.error("Error fetching location: ", error);
});
const goBack = () => {
    router.push('/'); 
};
</script>

<style scoped>
.weather-app {
    text-align: center;
}

ul {
    list-style-type: none;
    /* Remove default bullets */
    padding: 0;
    /* Remove default padding */
    margin: 0;
    /* Remove default margin */
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>