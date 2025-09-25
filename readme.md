Project Code

src/app/services/projects.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private projects: any[] = [];
  private selectedProjectSubject = new BehaviorSubject<any>(null);
  selectedProject$ = this.selectedProjectSubject.asObservable();

  setProjects(projects: any[]) {
    this.projects = projects;
    if (projects.length > 0) {
      this.setSelectedProject(projects[0]);
    }
  }

  getProjects() {
    return this.projects;
  }

  setSelectedProject(project: any) {
    this.selectedProjectSubject.next(project);
  }

  getSelectedProject() {
    return this.selectedProjectSubject.getValue();
  }
}

src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://example.com/api';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects`);
  }

  getFeed(projectUuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects/${projectUuid}/feed`);
  }

  getInsights(projectUuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects/${projectUuid}/insights`);
  }
}

src/app/components/project-menu/project-menu.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-project-menu',
  templateUrl: './project-menu.component.html',
  styleUrls: ['./project-menu.component.scss']
})
export class ProjectMenuComponent implements OnInit {
  projects: any[] = [];
  selectedProject: any;

  constructor(private api: ApiService, private projectsService: ProjectsService) {}

  ngOnInit() {
    this.api.getProjects().subscribe((data: any) => {
      this.projects = data;
      this.projectsService.setProjects(this.projects);
      this.selectedProject = this.projectsService.getSelectedProject();
    });

    this.projectsService.selectedProject$.subscribe(project => {
      this.selectedProject = project;
    });
  }

  selectProject(project: any) {
    this.projectsService.setSelectedProject(project);
  }
}

src/app/components/project-menu/project-menu.component.html

<ion-list>
  <ion-list-header>Projects</ion-list-header>
  <ion-item *ngFor="let project of projects" (click)="selectProject(project)" [color]="selectedProject?.uuid === project.uuid ? 'primary' : ''">
    {{ project.name }}
  </ion-item>
</ion-list>

src/app/pages/feed/feed.page.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss']
})
export class FeedPage implements OnInit {
  feedData: any[] = [];

  constructor(private api: ApiService, private projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.selectedProject$.subscribe(project => {
      if (project) {
        this.api.getFeed(project.uuid).subscribe((data: any) => {
          this.feedData = data;
        });
      }
    });
  }
}

src/app/pages/feed/feed.page.html

<ion-header>
  <ion-toolbar>
    <ion-title>Feed</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-list>
    <ion-item *ngFor="let item of feedData">
      {{ item.title }}
    </ion-item>
  </ion-list>
</ion-content>

src/app/pages/insights/insights.page.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.page.html',
  styleUrls: ['./insights.page.scss']
})
export class InsightsPage implements OnInit {
  insightsData: any[] = [];

  constructor(private api: ApiService, private projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.selectedProject$.subscribe(project => {
      if (project) {
        this.api.getInsights(project.uuid).subscribe((data: any) => {
          this.insightsData = data;
        });
      }
    });
  }
}

src/app/pages/insights/insights.page.html

<ion-header>
  <ion-toolbar>
    <ion-title>Insights</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-list>
    <ion-item *ngFor="let insight of insightsData">
      {{ insight.description }}
    </ion-item>
  </ion-list>
</ion-content>

src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/feed',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

src/app/tabs/tabs-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'feed',
        loadChildren: () => import('../pages/feed/feed.module').then(m => m.FeedPageModule)
      },
      {
        path: 'insights',
        loadChildren: () => import('../pages/insights/insights.module').then(m => m.InsightsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

src/app/app.component.html

<ion-app>
  <ion-menu contentId="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-project-menu></app-project-menu>
    </ion-content>
  </ion-menu>

  <div class="ion-page" id="main-content">
    <ion-router-outlet></ion-router-outlet>
  </div>
</ion-app>

src/app/app.module.ts

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
  bootstrap: [AppComponent]
})
export class AppModule {}

