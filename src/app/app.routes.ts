import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,

    children: [
      { path: '', redirectTo: 'cases', pathMatch: 'full' },
      {
        path: 'cases',
        loadChildren: () => import('./features/cases/cases.routes').then(m => m.CASES_ROUTES),
      },
    ],
  },
];
