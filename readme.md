import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private isConnected = new BehaviorSubject<boolean>(true);
  public networkStatus$ = this.isConnected.asObservable();

  constructor() {
    this.initNetworkListener();
  }

  async initNetworkListener() {
    const status = await Network.getStatus();
    this.isConnected.next(status.connected);

    Network.addListener('networkStatusChange', (status) => {
      this.isConnected.next(status.connected);
    });
  }
}


<ion-content class="ion-padding">
  <div class="no-network">
    <img src="assets/no-network.png" alt="No Network" />
    <h2>No Internet Connection</h2>
    <p>Please check your network settings.</p>
  </div>
</ion-content>

.no-network {
  text-align: center;
  img {
    width: 150px;
    margin: 30px auto;
  }
  h2 {
    color: #d32f2f;
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkService } from './services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private networkService: NetworkService,
    private router: Router
  ) {
    this.watchNetwork();
  }

  watchNetwork() {
    this.networkService.networkStatus$.subscribe(isConnected => {
      if (!isConnected) {
        this.router.navigate(['/network-error']);
      } else {
        // You can redirect back if needed
        // this.router.navigate(['/home']);
      }
    });
  }
}


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'network-error', loadChildren: () => import('./network-error/network-error.module').then(m => m.NetworkErrorPageModule) },
];