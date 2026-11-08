import { Component, input, output } from '@angular/core';

import { DxPopupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-pop-up',
  imports: [DxPopupComponent],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.scss',
})
export class PopUp {
  readonly title = input.required<string>();
  readonly visible = input(false);

  readonly visibleChange = output<boolean>();
}
