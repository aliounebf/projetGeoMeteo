import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { GeolocalisationComponent } from './geolocalisation/geolocalisation.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  async googleSignIn() {
    const provider = new GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return credential;
  }

  get user() {
    return this.afAuth.authState;
  }

  signOut() {
    return this.afAuth.signOut();
  }

  // Enregistrer la position dans Firestore
  async savePosition(position: GeolocalisationComponent) {
    const user = await this.afAuth.currentUser;
    if (user) {
      return this.firestore
        .collection('positions')
        .doc(user.uid)
        .collection('history')
        .add(position);
    }
    return;
  }

  // Récupérer l'historique des positions depuis Firestore
  getPositions(userId: string) {
    return this.firestore
      .collection('positions')
      .doc(userId)
      .collection('history')
      .valueChanges();
  }
}
