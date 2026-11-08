import { Component, input, output } from '@angular/core';
import { ActionBarAction } from '@shared/models/action-bar.model';
import { DxButtonComponent } from 'devextreme-angular/ui/button';
import { DxTabsComponent, DxTabsTypes } from 'devextreme-angular/ui/tabs';

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
  readonly actions = input<ActionBarAction[]>([]);

  readonly tabIndexChange = output<number>();

  protected onTabClick(event: DxTabsTypes.ItemClickEvent): void {
    if (typeof event.itemIndex === 'number') {
      this.tabIndexChange.emit(event.itemIndex);
    }
  }
}
