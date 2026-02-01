import axios from 'axios';

const API_KEY = 'dd85ce4ebfa025529ee77c5380b0a5c4';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (city, unit) => {
  const current = await axios.get(`${BASE_URL}/weather?q=${city}&units=${unit}&appid=${API_KEY}&lang=pl`);
  const forecast = await axios.get(`${BASE_URL}/forecast?q=${city}&units=${unit}&appid=${API_KEY}&lang=pl`);
  
  return { current: current.data, forecast: forecast.data };
};