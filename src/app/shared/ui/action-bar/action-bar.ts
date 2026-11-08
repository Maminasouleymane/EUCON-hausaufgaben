import { Component, input, output } from '@angular/core';
import { DxTabsComponent, DxTabsTypes } from 'devextreme-angular/ui/tabs';

import { DxButtonComponent } from 'devextreme-angular/ui/button';

@Component({
  selector: 'app-action-bar',
  imports: [DxTabsComponent, DxButtonComponent],
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.scss',
})
export class ActionBar {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly tabs = input<string[]>([]);
  readonly selectedTabIndex = input(0);
  readonly addButtonText = input('Add');

  readonly tabIndexChange = output<number>();
  readonly add = output<void>();
  readonly exportExcel = output<void>();

  protected onTabClick(event: DxTabsTypes.ItemClickEvent): void {
    if (typeof event.itemIndex === 'number') {
      this.tabIndexChange.emit(event.itemIndex);
    }
  }
}
