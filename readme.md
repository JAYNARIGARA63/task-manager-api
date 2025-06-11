import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-contact-group',
  templateUrl: './contact-group.page.html',
  styleUrls: ['./contact-group.page.scss'],
})
export class ContactGroupPage implements OnInit {
  form: FormGroup;
  allGroups: string[] = [];        // fetched from API
  contactGroups: string[] = [];   // fetched from API for that contact
  contactId: string = '1';        // example ID

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      groups: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.fetchDataFromAPI();
  }

  fetchDataFromAPI() {
    // Simulate API response
    this.allGroups = ['Family', 'Friends', 'Work', 'Gym'];
    this.contactGroups = ['Friends', 'Work'];

    const controls = this.allGroups.map(group =>
      this.fb.control(this.contactGroups.includes(group))
    );
    this.form.setControl('groups', this.fb.array(controls));
  }

  get groupsFormArray(): FormArray {
    return this.form.get('groups') as FormArray;
  }

  onSubmit() {
    const selectedGroups = this.groupsFormArray.value
      .map((checked: boolean, i: number) => checked ? this.allGroups[i] : null)
      .filter(group => group !== null);

    console.log('Updating contact:', this.contactId);
    console.log('Selected groups:', selectedGroups);

    // Call backend API here to update contact's groups
    // this.contactService.updateGroups(this.contactId, selectedGroups).subscribe(...)
  }
}



<ion-header>
  <ion-toolbar>
    <ion-title>Edit Contact Groups</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <ion-list>
      <ion-item *ngFor="let group of allGroups; let i = index">
        <ion-label>{{ group }}</ion-label>
        <ion-checkbox
          slot="end"
          [formControlName]="i"
          formArrayName="groups">
        </ion-checkbox>
      </ion-item>
    </ion-list>

    <ion-button expand="block" type="submit">
      Update Groups
    </ion-button>
  </form>
</ion-content>