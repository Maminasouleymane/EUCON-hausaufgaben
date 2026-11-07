import { Routes } from '@angular/router';
import { AppShell } from './layout/app-shell/app-shell';
import { NAVIGATION } from './layout/navigation.config';
import { PagePlaceholder } from './shared/ui/page-placeholder/page-placeholder';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      ...NAVIGATION.map((item) => ({
        path: item.path,
        component: PagePlaceholder,
        data: { title: item.text },
      })),
      { path: '', redirectTo: NAVIGATION[0].path, pathMatch: 'full' as const },
    ],
  },
];
