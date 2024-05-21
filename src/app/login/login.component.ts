import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { GeolocalisationComponent } from '../geolocalisation/geolocalisation.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  latitude: number | undefined;
  longitude: number | undefined;
  timestamp: Date | undefined;

  constructor(private authService: AuthService) {}

  signIn() {
    this.authService
      .googleSignIn()
      .then((credential) => {
        console.log('Connecté avec succès', credential.user);
        localStorage.setItem('user', JSON.stringify(credential.user));
      })
      .catch((error) => {
        console.log('Erreur de connexion', error);
      });
  }
  fullName: string = '';

  ngOnInit(): void {
    const isLogged = JSON.parse(localStorage.getItem('user') || '');
    this.fullName = isLogged.displayName;
  }

  signOut() {
    this.authService.signOut();
  }
}
