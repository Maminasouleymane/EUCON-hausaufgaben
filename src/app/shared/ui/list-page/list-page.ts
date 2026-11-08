import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChildren, input, signal } from '@angular/core';
import { ListPageTab } from '@shared/directives/list-page-tab/list-page-tab';
import { ActionBarAction } from '@shared/models/action-bar.model';

import { ActionBar } from '../action-bar/action-bar';

@Component({
  selector: 'app-list-page',
  imports: [ActionBar, NgTemplateOutlet],
  templateUrl: './list-page.html',
  styleUrl: './list-page.scss',
})
export class ListPage {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly tabs = input<string[]>([]);
  readonly actions = input<ActionBarAction[]>([]);

  protected readonly selectedTabIndex = signal(0);
  protected readonly tabTemplates = contentChildren(ListPageTab);
}
