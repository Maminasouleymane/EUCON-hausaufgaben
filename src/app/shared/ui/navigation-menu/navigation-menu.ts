import { Component, computed, input, output } from '@angular/core';
import { NAVIGATION } from '@app/layout/navigation.config';
import { DxTreeViewComponent, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';

@Component({
  selector: 'app-navigation-menu',
  imports: [DxTreeViewComponent],
  templateUrl: './navigation-menu.html',
  styleUrl: './navigation-menu.scss',
  host: {
    '[class.compact]': 'compactMode()',
  },
})
export class NavigationMenu {
  readonly compactMode = input(false);
  readonly selectedPath = input('');

  readonly itemClick = output<string>();

  protected readonly items = computed(() =>
    NAVIGATION.map((item) => {
      const path = `/${item.path}`;
      return { ...item, path, selected: path === this.selectedPath() };
    }),
  );

  protected onItemClick(event: DxTreeViewTypes.ItemClickEvent): void {
    const path = event.itemData?.['path'];
    if (typeof path === 'string') {
      this.itemClick.emit(path);
    }
  }
}
