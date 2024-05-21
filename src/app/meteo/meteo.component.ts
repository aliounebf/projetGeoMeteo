import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as L from 'leaflet';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css']
})
export class MeteoComponent implements OnInit {

  weatherData: any;
  latitude: number | undefined;
  longitude: number | undefined;

  icon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      iconUrl: '/assets/marker-icon.png',
      shadowUrl: '/assets/marker-shadow.png',
    }),
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getWeatherData();
      });
    } else {
      alert('La géolocalisation n\'est pas prise en charge par votre navigateur.');
    }
  }

  getWeatherData() {
    const API_KEY = '1651a5331e57ce3cbc76f82380944ebc';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&units=metric&appid=${API_KEY}`;
  
    this.http.get(apiUrl).subscribe((data) => {
      this.weatherData = data;
    });
  }

  initWeatherData(): void {
    this.weatherData = L.map('map', {
      center: [this.latitude || 39.8282, this.longitude || -98.5795],
      zoom: 12,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,

        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.weatherData);
    // Add a marker with custom icon at the specified coordinates
    if (this.latitude !== undefined && this.longitude !== undefined) {
      L.marker([this.latitude, this.longitude], { icon: this.icon.icon }).addTo(
        this.weatherData
      );
    }
  }

  setGeoLocation(position: {
    coords: { latitude: number; longitude: number };
  }) {
    const { latitude, longitude } = position.coords;
    this.latitude = latitude;
    this.longitude = longitude;

    if (!this.weatherData) {
      this.initWeatherData(); // Initialise la carte une fois que les coordonnées sont disponibles
    } else {
      this.weatherData.setView([latitude, longitude], 12); // Met à jour la vue avec la nouvelle position
    }
  }

}
