# Ionic Angular App with Side Menu + Tabs

## src/app/services/projects.service.ts
```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projects$ = new BehaviorSubject<any[]>([]);
  private selectedProject$ = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient) {}

  loadProjects() {
    this.http.get<any[]>('https://api.example.com/projects').subscribe(data => {
      this.projects$.next(data);
      if (data.length > 0) {
        this.setSelectedProject(data[0]);
      }
    });
  }

  getProjects() {
    return this.projects$.asObservable();
  }

  getSelectedProject() {
    return this.selectedProject$.asObservable();
  }

  setSelectedProject(project: any) {
    this.selectedProject$.next(project);
  }
}



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  getFeed(projectUuid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects/${projectUuid}/feed`);
  }

  getInsights(projectUuid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects/${projectUuid}/insights`);
  }
}


import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-project-menu',
  templateUrl: './project-menu.component.html',
  styleUrls: ['./project-menu.component.scss'],
})
export class ProjectMenuComponent implements OnInit {
  projects: any[] = [];
  selectedProject: any;

  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.getProjects().subscribe(data => {
      this.projects = data;
    });
    this.projectsService.getSelectedProject().subscribe(project => {
      this.selectedProject = project;
    });
  }

  selectProject(project: any) {
    this.projectsService.setSelectedProject(project);
  }
}

<ion-list>
  <ion-list-header>Projects</ion-list-header>
  <ion-item
    *ngFor="let project of projects"
    [color]="project.uuid === selectedProject?.uuid ? 'primary' : ''"
    (click)="selectProject(project)">
    {{ project.name }}
  </ion-item>
</ion-list>

import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  feed: any[] = [];

  constructor(
    private projectsService: ProjectsService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.projectsService.getSelectedProject().subscribe(project => {
      if (project) {
        this.loadFeed(project.uuid);
      }
    });
  }

  loadFeed(projectUuid: string) {
    this.api.getFeed(projectUuid).subscribe(data => {
      this.feed = data;
    });
  }
}


import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.page.html',
  styleUrls: ['./insights.page.scss'],
})
export class InsightsPage implements OnInit {
  insights: any[] = [];

  constructor(
    private projectsService: ProjectsService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.projectsService.getSelectedProject().subscribe(project => {
      if (project) {
        this.loadInsights(project.uuid);
      }
    });
  }

  loadInsights(projectUuid: string) {
    this.api.getInsights(projectUuid).subscribe(data => {
      this.insights = data;
    });
  }
}

<ion-app>
  <ion-split-pane contentId="main-content">
    <ion-menu contentId="main-content" type="overlay">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <app-project-menu></app-project-menu>
      </ion-content>
    </ion-menu>

    <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-split-pane>
</ion-app>


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProjectMenuComponent } from './components/project-menu/project-menu.component';

@NgModule({
  declarations: [AppComponent, ProjectMenuComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}