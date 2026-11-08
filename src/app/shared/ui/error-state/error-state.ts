import { Component, input, output } from '@angular/core';
import { DxButtonComponent } from 'devextreme-angular/ui/button';

@Component({
  selector: 'app-error-state',
  imports: [DxButtonComponent],
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
})
export class ErrorState {
  readonly message = input('An error has happened.');

  readonly retry = output<void>();
}
