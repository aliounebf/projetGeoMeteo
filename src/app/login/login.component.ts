import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { GeolocalisationComponent } from '../geolocalisation/geolocalisation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  latitude: number | undefined;
  longitude: number | undefined;
  timestamp: Date | undefined;

  constructor(public authService: AuthService, public router: Router) {}

  signIn() {
    this.authService
      .googleSignIn()
      .then((credential) => {
        console.log('Connecté avec succès', credential.user);
        localStorage.setItem('user', JSON.stringify(credential.user));
        window.location.reload();

      })
      .catch((error) => {
        console.log('Erreur de connexion', error);
      });
  }
  fullName: string = '';

  ngOnInit(): void {
    const isLogged = JSON.parse(localStorage.getItem('user') || '');
    if (isLogged) {

      console.log('Utilisateur connecté:', isLogged);
    }
    this.fullName = isLogged.displayName;

  }

  signOut() {
    this.authService.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/']);
        window.location.reload()
        console.log('Déconnecté avec succès');
      })
      .catch((error) => {
        console.error('Erreur de déconnexion', error);
      });
  }
}
