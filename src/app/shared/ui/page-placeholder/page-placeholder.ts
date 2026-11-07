import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-placeholder',
  template: `
    <h1>{{ title() }}</h1>
    <p>app page placeholder.</p>
  `,
})
export class PagePlaceholder {
  readonly title = input('');
}
