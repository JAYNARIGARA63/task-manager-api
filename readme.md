## 📄 contacts.page.ts

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

  allContacts: any[] = [];         // All contacts from API
  filteredContacts: any[] = [];    // After local search & filter
  displayedContacts: any[] = [];   // Displayed list (local pagination)

  searchText: string = '';
  selectedFilter: string = 'open';

  apiPage = 1;
  apiPageSize = 20;
  localPage = 1;
  localPageSize = 10;

  loading = false;
  hasMoreApiData = true;

  constructor(private http: HttpClient, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.loadFromApi();
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
            this.applyLocalFilter(true);
          },
        },
      ],
    });

    await alert.present();
  }

  onSearchChange() {
    this.applyLocalFilter(true);
  }

  loadFromApi() {
    if (this.loading || !this.hasMoreApiData) return;
    this.loading = true;

    const params = new HttpParams()
      .set('page', this.apiPage.toString())
      .set('pageSize', this.apiPageSize.toString());

    this.http.get<any[]>('https://your-api.com/api/contacts', { params }).subscribe({
      next: (data) => {
        if (data.length < this.apiPageSize) {
          this.hasMoreApiData = false;
        } else {
          this.apiPage++;
        }

        this.allContacts = [...this.allContacts, ...data];
        this.applyLocalFilter(); // Apply on new data
        this.loading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.loading = false;
      },
    });
  }

  applyLocalFilter(reset: boolean = false) {
    if (reset) {
      this.localPage = 1;
      this.displayedContacts = [];
      if (this.infiniteScroll) this.infiniteScroll.disabled = false;
    }

    this.filteredContacts = this.allContacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesFilter = this.selectedFilter === 'all' || contact.status === this.selectedFilter;
      return matchesSearch && matchesFilter;
    });

    const newChunk = this.filteredContacts.slice(0, this.localPage * this.localPageSize);
    this.displayedContacts = [...newChunk];
  }

  loadMore(event: any) {
    this.localPage++;

    const nextChunk = this.filteredContacts.slice(0, this.localPage * this.localPageSize);
    this.displayedContacts = [...nextChunk];

    event.target.complete();

    if (this.displayedContacts.length >= this.filteredContacts.length && this.hasMoreApiData) {
      this.loadFromApi(); // Fetch next API page
    }

    if (this.displayedContacts.length >= this.filteredContacts.length && !this.hasMoreApiData) {
      event.target.disabled = true;
    }
  }
}
```

---

## 📄 contacts.page.html

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
  <ion-searchbar
    [(ngModel)]="searchText"
    (ionInput)="onSearchChange()"
    placeholder="Search contacts">
  </ion-searchbar>

  <ion-list>
    <ion-item *ngFor="let contact of displayedContacts">
      {{ contact.name }} - {{ contact.status }}
    </ion-item>
  </ion-list>

  <ion-infinite-scroll threshold="100px" (ionInfinite)="loadMore($event)">
    <ion-infinite-scroll-content
      loadingSpinner="bubbles"
      loadingText="Loading more contacts...">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</ion-content>
```

---

## 📄 app.module.ts or contacts.module.ts

```ts
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    HttpClientModule,
    FormsModule,
    // other modules
  ]
})
export class AppModule {}
```

---

Let me know if you also want this as a downloadable `.md` file or want to add API mock for testing.