# 🔄 RefreshService for Ionic Angular with RxJS

A reusable RxJS-based service for refreshing data between unrelated Angular/Ionic components — perfect for list pages, form submissions, and tab navigation.

---

## ✅ Features

- Refresh data after form submission or other events
- Works across tabs, routes, and unrelated components
- Avoids duplicate API calls with clean separation
- Scales well for large apps (e.g., 100+ pages)

---

## 📁 `refresh.service.ts`

```ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshService {
  private subjects: { [key: string]: Subject<void> } = {};

  getRefreshObservable(key: string): Observable<void> {
    if (!this.subjects[key]) {
      this.subjects[key] = new Subject<void>();
    }
    return this.subjects[key].asObservable();
  }

  triggerRefresh(key: string): void {
    if (!this.subjects[key]) {
      this.subjects[key] = new Subject<void>();
    }
    this.subjects[key].next();
  }
}


// client.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RefreshService } from 'src/app/services/refresh.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
})
export class ClientPage implements OnInit, OnDestroy {
  private refreshSub!: Subscription;
  clients: any[] = [];

  constructor(private refreshService: RefreshService) {}

  ngOnInit() {
    this.refreshSub = this.refreshService.getRefreshObservable('client')
      .subscribe(() => {
        this.fetchClientList(); // Refresh triggered
      });
  }

  ionViewWillEnter() {
    this.fetchClientList(); // Load on tab enter
  }

  fetchClientList() {
    // Example: API call to fetch client list
    // this.http.get('/api/clients').subscribe(res => this.clients = res);
    console.log('Fetching client list...');
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }
}


// add-client.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshService } from 'src/app/services/refresh.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.page.html',
})
export class AddClientPage {
  constructor(
    private router: Router,
    private refreshService: RefreshService
  ) {}

  onSubmit() {
    // Example: After successful form submission
    // this.http.post('/api/clients', formData).subscribe(() => { ... });

    console.log('Client added! Navigating and triggering refresh...');
    this.refreshService.triggerRefresh('client');
    this.router.navigateByUrl('/tabs/client');
  }
}