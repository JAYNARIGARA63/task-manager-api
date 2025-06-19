# 📄 `contacts.page.ts`

```ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AlertController, IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  allContacts: any[] = [];         // All loaded contacts from API
  displayedContacts: any[] = [];   // Filtered + searched contacts for display

  searchText: string = '';
  selectedFilter: string = 'open'; // Default filter

  apiPage = 1;
  apiPageSize = 20;

  hasMoreData = true;
  loading = false;

  constructor(private http: HttpClient, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.fetchContactsFromApi();
  }

  async presentFilter() {
    const alert = await this.alertCtrl.create({
      header: 'Filter Contacts',
      inputs: [
        { label: 'All', type: 'radio', value: 'all', checked: this.selectedFilter === 'all' },
        { label: 'Unassigned', type: 'radio', value: 'unassigned', checked: this.selectedFilter === 'unassigned' },
        { label: 'Open', type: 'radio', value: 'open', checked: this.selectedFilter === 'open' },
        { label: 'Close', type: 'radio', value: 'close', checked: this.selectedFilter === 'close' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Apply',
          handler: (value: string) => {
            this.selectedFilter = value;
            this.applySearchAndFilter();
          },
        },
      ],
    });

    await alert.present();
  }

  onSearchChange() {
    this.applySearchAndFilter();
  }

  // Fetch next page from API
  fetchContactsFromApi() {
    if (this.loading || !this.hasMoreData) return;

    this.loading = true;

    const params = new HttpParams()
      .set('page', this.apiPage.toString())
      .set('pageSize', this.apiPageSize.toString());

    this.http.get<any[]>('https://your-api.com/api/contacts', { params }).subscribe({
      next: (data) => {
        if (data.length < this.apiPageSize) {
          this.hasMoreData = false;
        } else {
          this.apiPage++;
        }

        this.allContacts = [...this.allContacts, ...data];
        this.applySearchAndFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.loading = false;
      },
    });
  }

  // Local search + filter
  applySearchAndFilter() {
    const filtered = this.allContacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesFilter =
        this.selectedFilter === 'all' || contact.status === this.selectedFilter;
      return matchesSearch && matchesFilter;
    });

    this.displayedContacts = filtered;
  }

  // Triggered on infinite scroll
  loadMore(event: any) {
    this.fetchContactsFromApi();
    setTimeout(() => {
      event.target.complete();
      if (!this.hasMoreData) {
        event.target.disabled = true;
      }
    }, 500);
  }
}
```

---

# 📄 `contacts.page.html`

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Contacts</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="presentFilter()">Filter</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <!-- Search Bar -->
  <ion-searchbar
    [(ngModel)]="searchText"
    (ionInput)="onSearchChange()"
    placeholder="Search contacts...">
  </ion-searchbar>

  <!-- Contact List -->
  <ion-list>
    <ion-item *ngFor="let contact of displayedContacts">
      {{ contact.name }} - {{ contact.status }}
    </ion-item>
  </ion-list>

  <!-- Infinite Scroll -->
  <ion-infinite-scroll threshold="100px" (ionInfinite)="loadMore($event)">
    <ion-infinite-scroll-content
      loadingSpinner="bubbles"
      loadingText="Loading more contacts...">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</ion-content>
```

---

# 📄 `app.module.ts` or `contacts.module.ts`

```ts
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    HttpClientModule,
    FormsModule,
    // other modules...
  ]
})
export class AppModule {}
```

---

# ✅ Expected API Endpoint

- Endpoint: `https://your-api.com/api/contacts`
- Method: `GET`
- Query Parameters: `page`, `pageSize`
- Example:  
  ```
  https://your-api.com/api/contacts?page=1&pageSize=20
  ```

- Expected response:
```json
[
  { "name": "John", "status": "open" },
  { "name": "Alice", "status": "unassigned" }
]
```

---

Let me know if you want this in a downloadable file or want to support a response structure like:

```json
{ "data": [...], "meta": { "totalPages": 5 } }
``` 

I'll modify it for that too.