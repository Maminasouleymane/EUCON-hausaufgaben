import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({ selector: 'ng-template[appListPageTab]' })
export class ListPageTab {
  readonly templateRef = inject(TemplateRef);
}
