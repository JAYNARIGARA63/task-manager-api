# Task Time Tracking Module (Ionic Angular)

This module adds **time tracking** functionality with **start, pause, resume, end** buttons for tasks.  
It ensures that only one task can run at a time, tracks local UI time, and calls backend APIs.

---

## 📌 `time-tracking.service.ts`

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {
  private currentTaskId: number | null = null;
  private timers: { [taskId: number]: { elapsed: number, intervalId?: any } } = {};

  constructor(private http: HttpClient) {}

  startTask(taskId: number) {
    if (this.currentTaskId && this.currentTaskId !== taskId) {
      this.pauseTask(this.currentTaskId);
    }

    if (!this.timers[taskId]) {
      this.timers[taskId] = { elapsed: 0 };
    }

    this.currentTaskId = taskId;
    this.timers[taskId].intervalId = setInterval(() => {
      this.timers[taskId].elapsed++;
    }, 1000);

    return this.http.post(`/api/tasks/${taskId}/start`, {});
  }

  pauseTask(taskId: number) {
    if (this.timers[taskId]?.intervalId) {
      clearInterval(this.timers[taskId].intervalId);
      this.timers[taskId].intervalId = undefined;
      this.http.post(`/api/tasks/${taskId}/pause`, {}).subscribe();
    }
    if (this.currentTaskId === taskId) {
      this.currentTaskId = null;
    }
  }

  resumeTask(taskId: number) {
    if (this.currentTaskId && this.currentTaskId !== taskId) {
      this.pauseTask(this.currentTaskId);
    }

    this.currentTaskId = taskId;
    this.timers[taskId].intervalId = setInterval(() => {
      this.timers[taskId].elapsed++;
    }, 1000);

    return this.http.post(`/api/tasks/${taskId}/resume`, {});
  }

  endTask(taskId: number) {
    if (this.timers[taskId]?.intervalId) {
      clearInterval(this.timers[taskId].intervalId);
    }
    this.currentTaskId = null;
    this.http.post(`/api/tasks/${taskId}/end`, {}).subscribe();
  }

  getElapsedTime(taskId: number): number {
    return this.timers[taskId]?.elapsed || 0;
  }

  isTaskRunning(taskId: number): boolean {
    return !!this.timers[taskId]?.intervalId;
  }
}

# Task Component (Ionic Angular)

This component shows a task list with **start, pause, resume, end** functionality and integrates with the `TimeTrackingService`.

---

## task.page.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { TimeTrackingService } from '../services/time-tracking.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  tasks: any[] = [];

  constructor(private timeTrackingService: TimeTrackingService) {}

  ngOnInit() {
    // Normally you call your API to get tasks
    this.tasks = [
      { id: 1, name: 'Task 1', status: 'pending', createdAt: new Date(), category: 'Work', trackedTime: 0 },
      { id: 2, name: 'Task 2', status: 'pending', createdAt: new Date(), category: 'Personal', trackedTime: 0 }
    ];

    this.timeTrackingService.tasks = this.tasks;
  }

  startTask(taskId: number) {
    this.timeTrackingService.startTask(taskId);
  }

  pauseTask(taskId: number) {
    this.timeTrackingService.pauseTask(taskId);
  }

  resumeTask(taskId: number) {
    this.timeTrackingService.resumeTask(taskId);
  }

  endTask(taskId: number) {
    this.timeTrackingService.endTask(taskId);
  }
}


# task.page.html

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Task List</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-list>
    <ion-item *ngFor="let task of tasks">
      <ion-label>
        <h2>{{ task.name }}</h2>
        <p>Status: {{ task.status }}</p>
        <p>Category: {{ task.category }}</p>
        <p>Tracked Time: {{ task.trackedTime }}s</p>
      </ion-label>

      <div class="actions">
        <ion-button *ngIf="task.status === 'pending'" (click)="startTask(task.id)" color="success">Start</ion-button>
        <ion-button *ngIf="task.status === 'running'" (click)="pauseTask(task.id)" color="warning">Pause</ion-button>
        <ion-button *ngIf="task.status === 'paused'" (click)="resumeTask(task.id)" color="primary">Resume</ion-button>
        <ion-button *ngIf="task.status === 'running' || task.status === 'paused'" (click)="endTask(task.id)" color="danger">End</ion-button>
      </div>
    </ion-item>
  </ion-list>
</ion-content>



# task.page.scss

```scss
ion-item {
  --padding-start: 16px;
  --inner-padding-end: 16px;
  align-items: flex-start;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: auto;
}

ion-button {
  --border-radius: 8px;
  font-size: 14px;
  height: 32px;
}
