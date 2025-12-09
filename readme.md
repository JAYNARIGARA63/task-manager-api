```
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.page.html',
  styleUrls: ['./trip-detail.page.scss'],
})
export class TripDetailPage implements OnInit {

  trip = { 
    // your API or static trip data
    trip_details: []
  };

  ngOnInit() {
    this.loadTrip();
  }

  loadTrip() {
    // Load from API or static JSON
    this.trip.trip_details = JSON.parse(localStorage.getItem('tripData')) || this.getDummyData();

    this.updateButtonStates();
  }

  getDummyData() {
    return [
      { id:1, location:'surat', is_skipped:false, in_time:null, out_time:null },
      { id:2, location:'ahmedabad', is_skipped:false, in_time:null, out_time:null },
      { id:3, location:'baroda', is_skipped:false, in_time:null, out_time:null },
      { id:4, location:'gandhinagar', is_skipped:false, in_time:null, out_time:null }
    ];
  }

  // ----------------------------
  // MAIN BUTTON VISIBILITY LOGIC
  // ----------------------------
  updateButtonStates() {
    const details = this.trip.trip_details;

    details.forEach((loc, index) => {
      loc.showCheckIn = false;
      loc.showCheckOut = false;
      loc.showSkip = false;

      // If skipped → no buttons
      if (loc.is_skipped === true) return;

      // FIRST LOCATION
      if (index === 0) {
        if (!loc.out_time) {
          loc.showCheckOut = true;
        }
        return;
      }

      // NOT FIRST LOCATION
      const prev = details[index - 1];

      const prevDone = (prev.out_time !== null) || prev.is_skipped;

      // SHOW CHECK-IN ONLY WHEN PREVIOUS IS COMPLETE
      if (!loc.in_time && prevDone) {
        loc.showCheckIn = true;
        loc.showSkip = true;  // Skip allowed before check-in
      }

      // AFTER CHECK-IN
      if (loc.in_time && !loc.out_time) {
        loc.showCheckOut = true;
      }
    });

    localStorage.setItem('tripData', JSON.stringify(details));
  }

  // ----------------------------
  // USER ACTIONS
  // ----------------------------
  doCheckIn(loc) {
    loc.in_time = new Date().toISOString();
    this.updateButtonStates();
  }

  doCheckOut(loc) {
    loc.out_time = new Date().toISOString();
    this.updateButtonStates();
  }

  doSkip(loc) {
    loc.is_skipped = true;
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
