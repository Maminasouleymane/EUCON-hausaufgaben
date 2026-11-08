import { Component, input } from '@angular/core';

@Component({
  selector: 'app-filter-field',
  templateUrl: './filter-field.html',
  styleUrl: './filter-field.scss',
})
export class FilterField {
  readonly label = input.required<string>();
}
