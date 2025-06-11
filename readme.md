<ion-header>
  <ion-toolbar>
    <ion-title>Manage Group</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <ion-list>
      <ion-item *ngFor="let group of groupControls; let i = index">
        <ion-label>{{ allGroups[i].name }}</ion-label>
        <ion-checkbox slot="end" [formControl]="group"></ion-checkbox>
      </ion-item>
    </ion-list>

    <ion-button expand="block" type="submit">Save Changes</ion-button>
  </form>
</ion-content>


import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-manage-group',
  standalone: true, // ✅ Must be standalone
  templateUrl: './manage-group.page.html',
  styleUrls: ['./manage-group.page.scss'],
  imports: [
    CommonModule,
    IonicModule, // ✅ Add IonicModule for <ion-*> components
    FormsModule,
    ReactiveFormsModule, // If you're using reactive forms
  ],
})
export class ManageGroupPage implements OnInit {
  form!: FormGroup;

  allGroups = [
    { uuid: 'g1', name: 'Group A' },
    { uuid: 'g2', name: 'Group B' },
    { uuid: 'g3', name: 'Group C' },
  ];

  contactGroupUUIDs = ['g1', 'g3']; // groups already assigned to contact

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      groups: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.loadGroupControls();
  }

  loadGroupControls() {
    const formArray = this.form.get('groups') as FormArray;
    this.allGroups.forEach((group) => {
      const isChecked = this.contactGroupUUIDs.includes(group.uuid);
      formArray.push(new FormControl(isChecked));
    });
  }
  get groupControls(): FormControl[] {
    return (this.form.get('groups') as FormArray).controls as FormControl[];
  }
  onSubmit() {
    const selectedGroups = this.groupControls
      .map((ctrl, i) => (ctrl.value ? this.allGroups[i].uuid : null))
      .filter((uuid) => uuid !== null);

    console.log('Selected groups:', selectedGroups);
  }
}
