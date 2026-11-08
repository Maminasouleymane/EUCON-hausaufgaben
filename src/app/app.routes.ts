import { Routes } from '@angular/router';
import { AppShell } from './layout/app-shell/app-shell';
import { NAVIGATION } from './layout/navigation.config';
import { PagePlaceholder } from './shared/ui/page-placeholder/page-placeholder';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      {
        path: 'events',
        loadComponent: () =>
          import('./features/events/ui/events-list-page/events-list-page').then(
            (m) => m.EventsListPage,
          ),
      },
      ...NAVIGATION.filter((item) => item.path !== 'events').map((item) => ({
        path: item.path,
        component: PagePlaceholder,
        data: { title: item.text },
      })),
      { path: '', redirectTo: NAVIGATION[0].path, pathMatch: 'full' as const },
    ],
  },
];
