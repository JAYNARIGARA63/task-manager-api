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
  // Find last completed or skipped location
  const lastDoneIndex = this.tripDetails.findIndex((loc, i) =>
    loc.in_time !== null || loc.out_time !== null || loc.is_skipped
  );

  // If none done yet → last done = first location automatically
  const lastCompleted = lastDoneIndex === -1 ? 0 : lastDoneIndex;

  this.tripDetails = this.tripDetails.map((loc, index) => {
    const isFirst = index === 0;
    const isLastCompleted = index === lastCompleted;
    const isNextAfterCompleted = index === lastCompleted + 1;

    // Default hide all buttons
    loc.showCheckIn = false;
    loc.showCheckOut = false;
    loc.showSkip = false;

    // FIRST LOCATION RULE
    if (isFirst) {
      if (!loc.out_time) {
        loc.showCheckOut = true; // Only check-out button
      }
      return loc;
    }

    // SKIPPED LOCATION RULE
    if (loc.is_skipped) {
      return loc; // No buttons for skipped
    }

    // CURRENT ACTIVE LOCATION (in-progress)
    if (isLastCompleted && loc.in_time && !loc.out_time) {
      loc.showCheckOut = true;
      return loc;
    }

    // NEXT LOCATION SHOULD SHOW CHECK-IN + SKIP
    if (isNextAfterCompleted && !loc.in_time && !loc.is_skipped) {
      loc.showCheckIn = true;
      loc.showSkip = true;
      return loc;
    }

    // FUTURE LOCATIONS → no buttons
    return loc;
  });
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
