```
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.page.html',
  styleUrls: ['./trip-detail.page.scss'],
})
export class TripDetailPage implements OnInit {

  tripData: any = {
    trip_details: []
  };

  ngOnInit() {
    this.loadTripData();
  }

  loadTripData() {
    // Load from backend / localStorage (example using your JSON)
    this.tripData = {
      trip_details: [
        {
          id: 1,
          location: 'surat',
          approx_in_time: '10:30 AM',
          approx_out_time: '11:00 AM',
          in_time: null,
          out_time: null,
          is_skipped: false
        },
        {
          id: 2,
          location: 'ahmedabad',
          approx_in_time: '11:30 AM',
          approx_out_time: '12:00 PM',
          in_time: null,
          out_time: null,
          is_skipped: false
        },
        {
          id: 3,
          location: 'baroda',
          approx_in_time: '12:30 PM',
          approx_out_time: '01:00 PM',
          in_time: null,
          out_time: null,
          is_skipped: false
        },
        {
          id: 4,
          location: 'gandhinagar',
          approx_in_time: '01:30 PM',
          approx_out_time: '02:00 PM',
          in_time: null,
          out_time: null,
          is_skipped: false
        }
      ]
    };

    this.updateButtonStates();
  }

  // ----------------------------------------------------------
  // MAIN LOGIC — updates UI button states
  // ----------------------------------------------------------
  updateButtonStates() {
    const details = this.tripData.trip_details;

    details.forEach((item, index) => {
      item.showCheckIn = false;
      item.showCheckOut = false;
      item.showSkip = false;

      if (item.is_skipped) {
        return;
      }

      if (index === 0) {
        item.showCheckOut = !item.out_time; 
      } else {
        const prev = details[index - 1];

        const prevCompleted =
          prev.out_time !== null || prev.is_skipped === true;

        if (prevCompleted) {
          if (!item.in_time) {
            item.showCheckIn = true;
            item.showSkip = true;
          } else if (item.in_time && !item.out_time) {
            item.showCheckOut = true;
          }
        }
      }
    });
  }

  // ----------------------------------------------------------
  // CHECK-IN
  // ----------------------------------------------------------
  checkIn(item: any) {
    item.in_time = new Date().toISOString();
    this.updateButtonStates();
  }

  // ----------------------------------------------------------
  // CHECK-OUT
  // ----------------------------------------------------------
  checkOut(item: any) {
    item.out_time = new Date().toISOString();
    this.updateButtonStates();
  }

  // ----------------------------------------------------------
  // SKIP
  // ----------------------------------------------------------
  skip(item: any) {
    item.is_skipped = true;
    this.updateButtonStates();
  }
}
<ion-list>
  <ion-item *ngFor="let loc of trip.trip_details; let i = index">

    <ion-label>
      <h2>{{ loc.location }}</h2>
      <p>IN: {{ loc.in_time || '—' }}</p>
      <p>OUT: {{ loc.out_time || '—' }}</p>
      <p *ngIf="loc.is_skipped" style="color:red;">Skipped</p>
    </ion-label>

    <ion-buttons slot="end">

      <!-- CHECK-IN -->
      <ion-button color="primary" *ngIf="loc.showCheckIn" (click)="doCheckIn(loc)">
        Check In
      </ion-button>

      <!-- CHECK-OUT -->
      <ion-button color="secondary" *ngIf="loc.showCheckOut" (click)="doCheckOut(loc)">
        Check Out
      </ion-button>

      <!-- SKIP -->
      <ion-button color="danger" *ngIf="loc.showSkip" (click)="doSkip(loc)">
        Skip
      </ion-button>

    </ion-buttons>

  </ion-item>
</ion-list>

```
