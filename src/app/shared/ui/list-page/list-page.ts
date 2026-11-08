import { Component, input, output, signal } from '@angular/core';
import { ActionBar } from '../action-bar/action-bar';

@Component({
  selector: 'app-list-page',
  imports: [ActionBar],
  templateUrl: './list-page.html',
  styleUrl: './list-page.scss',
})
export class ListPage {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly tabs = input<string[]>([]);
  readonly addButtonText = input('Add');

  readonly add = output<void>();
  readonly exportExcel = output<void>();

  protected readonly selectedTabIndex = signal(0);
}
