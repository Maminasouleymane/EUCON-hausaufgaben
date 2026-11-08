import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { DxDrawerComponent } from 'devextreme-angular/ui/drawer';
import { DxTemplateDirective } from 'devextreme-angular/core';
import { Header } from '../../shared/ui/header/header';
import { NavigationMenu } from '../../shared/ui/navigation-menu/navigation-menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, DxDrawerComponent, DxTemplateDirective, Header, NavigationMenu],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly router = inject(Router);

  protected readonly title = 'EUCON Events Management';
  protected readonly menuOpened = signal(true);
  protected readonly selectedPath = signal(this.router.url.split('?')[0]);
  protected readonly compactMode = computed(() => !this.menuOpened());

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedPath.set(event.urlAfterRedirects.split('?')[0]);
      }
    });
  }

  protected toggleMenu(): void {
    this.menuOpened.update((opened) => !opened);
  }

  protected onNavigate(path: string): void {
    this.router.navigate([path]);
  }
}
