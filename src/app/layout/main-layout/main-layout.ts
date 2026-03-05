import { Component, signal } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterModule,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CommonModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  collapsed = signal(false);

  navItems = [
    { icon: 'folder_open', label: 'Expedientes', route: '/cases' },
    { icon: 'calendar_today', label: 'Audiencias', route: '/hearings' },
    { icon: 'people', label: 'Clients', route: '/clients' },
    { icon: 'bar_chart', label: 'Reportes', route: '/reports' },
  ];
}
