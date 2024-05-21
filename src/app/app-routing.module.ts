import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeteoComponent } from './meteo/meteo.component';
import { GeolocalisationComponent } from './geolocalisation/geolocalisation.component';

const routes: Routes = [
  // { path: '', redirectTo: '/', pathMatch: 'full' }, // Redirection vers le composant premier
  { path: '', component: GeolocalisationComponent },
  { path: 'meteo', component: MeteoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
