import { Routes } from '@angular/router';

export const CASES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/cases-list/cases-list').then(m => m.CasesList),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/case-detail/case-detail').then(m => m.CaseDetail),
  },
];
