// weather.service.ts

import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  apiKey = '7d09ea66214efb5549b5cf089984ec3c';

  constructor() {}

  getCurrentWeather(latitude: number, longitude: number) {
    // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${'dakar'}&appid=${
      this.apiKey
    }&units=metric`;

    return axios.get(url); // Utilisation d'axios pour effectuer la requête HTTP GET
  }
}
