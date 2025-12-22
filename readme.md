```
/* =====================================
   status-rules.ts
   ===================================== */

export const STATUS_FLOW: Record<string, string[]> = {
  pending: ['pending', 'on hold', 'processing', 'canceled'],
  'on hold': ['on hold', 'processing', 'canceled'],
  processing: ['processing', 'completed', 'failed'],
  completed: ['completed', 'refunded'],
  delivered: ['delivered', 'refunded'],
  canceled: ['canceled'],
  failed: ['failed', 'refunded'],
  refunded: ['refunded']
};

<!-- =====================================
     order-list.page.html
     ===================================== -->

<ion-header>
  <ion-toolbar>
    <ion-title>Orders</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>

  <ion-list>
    <ion-item-sliding *ngFor="let order of orders">

      <!-- Order Item -->
      <ion-item>
        <ion-label>
          <h2>Order #{{ order.orderNumber }}</h2>
          <p>Amount: ₹{{ order.amount }}</p>
          <p>
            Status:
            <strong>{{ order.status | titlecase }}</strong>
          </p>
        </ion-label>
      </ion-item>

      <!-- Sliding Options -->
      <ion-item-options side="end">
        <ion-item-option
          color="primary"
          (click)="openStatusActionSheet(order)"
        >
          Change Status
        </ion-item-option>
      </ion-item-options>

    </ion-item-sliding>
  </ion-list>

</ion-content>

/* =====================================
   order-list.page.ts
   ===================================== */

import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { STATUS_FLOW } from './status-rules';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss']
})
export class OrderListPage {

  orders = [
    {
      id: 1,
      orderNumber: 'ORD-101',
      amount: 1200,
      status: 'pending'
    },
    {
      id: 2,
      orderNumber: 'ORD-102',
      amount: 3000,
      status: 'completed'
    }
  ];

  constructor(private actionSheetCtrl: ActionSheetController) {}

  async openStatusActionSheet(order: any) {
    const allowedStatuses = STATUS_FLOW[order.status] || [];

    const buttons = allowedStatuses.map(status => {
      const isCurrent = status === order.status;

      return {
        text: isCurrent
          ? `✓ ${status.toUpperCase()}`
          : status.toUpperCase(),

        cssClass: isCurrent ? 'current-status' : '',
        disabled: isCurrent,

        handler: () => {
          if (!isCurrent) {
            this.changeStatus(order, status);
          }
        }
      };
    });

    // Only this button can close the action sheet
    buttons.push({
      text: 'Cancel',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Change Order Status',
      buttons,
      backdropDismiss: false   // IMPORTANT: disable background close
    });

    await actionSheet.present();
  }

  changeStatus(order: any, newStatus: string) {
    order.status = newStatus;
    this.updateOrderStatusAPI(order.id, newStatus);
  }

  updateOrderStatusAPI(orderId: number, status: string) {
    const payload = { status };
    console.log('Update Order API:', orderId, payload);

    // Example API call
    // this.orderService.updateOrderStatus(orderId, payload).subscribe()
  }
}


/* =====================================
   order-list.page.scss
   ===================================== */

ion-action-sheet .current-status {
  font-weight: 700;
  color: var(--ion-color-primary);
  opacity: 1;
}

```
