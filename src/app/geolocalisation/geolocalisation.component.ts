import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as L from 'leaflet';

@Component({
  selector: 'app-geolocalisation',
  templateUrl: './geolocalisation.component.html',
  styleUrls: ['./geolocalisation.component.css'],
})
export class GeolocalisationComponent implements OnInit {
  map: any;
  weatherData: any;
  latitude: number | undefined;
  longitude: number | undefined;
  currentUser: any;
  geolocations: any[] = [];
  icon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      iconUrl: '/assets/marker-icon.png',
      shadowUrl: '/assets/marker-shadow.png',
    }),
  };

  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '');
    if (this.currentUser) {
      this.loadUserGeolocations();
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.setGeoLocation.bind(this),
        (error) => {
          console.error('Erreur lors de la récupération de la position', error);
          alert('Impossible de récupérer votre position');
        }
      );
    } else {
      alert('Vous devez autoriser la localisation pour voir votre position');
    }
  }

  initMap(): void {
    this.map = L.map('map', {
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

    tiles.addTo(this.map);
    // Add a marker with custom icon at the specified coordinates
    if (this.latitude !== undefined && this.longitude !== undefined) {
      L.marker([this.latitude, this.longitude], { icon: this.icon.icon }).addTo(
        this.map
      );
      const API_KEY = '1651a5331e57ce3cbc76f82380944ebc';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&units=metric&appid=${API_KEY}`;

      this.http.get(apiUrl).subscribe((data) => {
        this.weatherData = data;
        this.firestore
          .collection(`geolocations/${this.currentUser.uid}/locations`)
          .add({
            description: this.weatherData.weather[0].description,
            temperature: this.weatherData.main.temp,
            humidite: this.weatherData.main.humidity,
            latitude: this.latitude,
            longitude: this.longitude,
            timestamp: new Date(), // Ajoutez le timestamp actuel
          });
      });
    }
  }
  loadUserGeolocations(): void {
    if (this.currentUser) {
      this.firestore
        .collection(`geolocations/${this.currentUser.uid}/locations`, (ref) =>
          ref.orderBy('timestamp', 'desc')
        )
        .valueChanges()
        .subscribe((data: any[]) => {
          this.geolocations = data;
          this.displayMarkers();
        });
    }
  }

  displayMarkers(): void {
    if (this.map && this.geolocations) {
      // Parcourir les positions et ajouter des marqueurs sur la carte
      this.geolocations.forEach((location: any) => {
        const { latitude, longitude } = location;
        if (latitude !== undefined && longitude !== undefined) {
          L.marker([latitude, longitude], { icon: this.icon.icon }).addTo(
            this.map
          ).bindPopup(`
              <b>Date et heure:</b> ${location.timestamp.toDate()}<br>
              <b>Latitude:</b> ${latitude}<br>
              <b>Longitude:</b> ${longitude}<br>
              <b>Météo:</b> ${location.description}<br>
              <b>Température:</b> ${location.temperature} °C<br>
              <b>Humidité:</b> ${location.humidite}%
            `);
        }
      });
    }
  }

  setGeoLocation(position: {
    coords: { latitude: number; longitude: number };
  }) {
    const { latitude, longitude } = position.coords;
    this.latitude = latitude;
    this.longitude = longitude;

    if (!this.map) {
      this.initMap(); // Initialise la carte une fois que les coordonnées sont disponibles
    } else {
      this.map.setView([latitude, longitude], 12); // Met à jour la vue avec la nouvelle position
    }
  }
}
