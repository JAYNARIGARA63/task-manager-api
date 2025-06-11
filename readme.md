# 🧾 Manage Contact Groups – Ionic Angular Example

This example demonstrates how to build an **edit form** in an Ionic Angular app using **Reactive Forms**. It shows a list of checkboxes representing groups, pre-selects some based on API data, and updates the selected groups on form submission.

---

## ✅ Features

- ✅ Reactive Form using `FormArray`
- ✅ Load groups from API
- ✅ Pre-select groups based on contact data
- ✅ Update selected groups on form submit

---

## 📁 File Structure

```
src/
  app/
    contact-group/
      contact-group.page.ts
      contact-group.page.html
      contact-group.page.scss
```

---

## 📄 contact-group.page.ts

```ts
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
```

---

## 📄 contact-group.page.html

```html
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
```

---

## 📦 How to Use

1. Add `ReactiveFormsModule` in your `app.module.ts`:

```ts
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule
  ]
})
```

2. Replace mock data in `fetchDataFromAPI()` with actual API calls.

---

## ✅ Output Example

If `Friends` and `Work` were selected already, and you select `Gym`, the console logs:

```
Updating contact: 1
Selected groups: ['Friends', 'Work', 'Gym']
```

---

Let me know if you want a version with API service or group IDs.