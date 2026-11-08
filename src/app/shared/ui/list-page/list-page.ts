import { Component, input, signal } from '@angular/core';

import { ActionBar } from '../action-bar/action-bar';
import { ActionBarAction } from '../../models/action-bar.model';

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
  readonly actions = input<ActionBarAction[]>([]);

  protected readonly selectedTabIndex = signal(0);
}
