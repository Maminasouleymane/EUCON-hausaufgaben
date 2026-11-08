import { Component, computed, input, output, signal, viewChild } from '@angular/core';
import { DxFormComponent, DxFormTypes } from 'devextreme-angular/ui/form';
import { EventStatus, NewEventFormData } from '../../models/event.model';

import { DxButtonComponent } from 'devextreme-angular/ui/button';
import { PopUp } from '../../../../shared/ui/pop-up/pop-up';
import { createEmptyFormData } from '../../utils/helpers';

@Component({
  selector: 'app-add-event-popup',
  imports: [DxFormComponent, PopUp, DxButtonComponent],
  templateUrl: './add-event-popup.html',
  styleUrl: './add-event-popup.scss',
})
export class AddEventPopup {
  readonly visible = input(false);
  readonly statuses = input<EventStatus[]>([]);
  readonly locations = input<string[]>([]);

  readonly visibleChange = output<boolean>();
  readonly save = output<NewEventFormData>();

  protected readonly formData = signal<NewEventFormData>(createEmptyFormData());

  private readonly form = viewChild(DxFormComponent);

  protected readonly items = computed<DxFormTypes.SimpleItem[]>(() => [
    {
      dataField: 'name',
      editorType: 'dxTextBox',
      label: { text: 'Event Name' },
      validationRules: [{ type: 'required', message: 'Event name is required' }],
    },
    {
      dataField: 'location',
      editorType: 'dxSelectBox',
      label: { text: 'Location' },
      editorOptions: { items: this.locations() },
      validationRules: [{ type: 'required', message: 'Location is required' }],
    },
    {
      dataField: 'status',
      editorType: 'dxSelectBox',
      label: { text: 'Status' },
      editorOptions: { items: this.statuses() },
      validationRules: [{ type: 'required', message: 'Status is required' }],
    },
    {
      dataField: 'date',
      editorType: 'dxDateBox',
      label: { text: 'Date' },
      editorOptions: { displayFormat: 'MMM d, yyyy' },
      validationRules: [
        { type: 'required', message: 'Date is required' },
        {
          type: 'custom',
          message: 'Date must be in the future',
          validationCallback: (e: { value?: Date | null }) =>
            !!e.value && e.value.getTime() > Date.now(),
        },
      ],
    },
    {
      dataField: 'participantCount',
      editorType: 'dxNumberBox',
      label: { text: 'Participants' },
      editorOptions: { min: 3, max: 10 },
      validationRules: [
        { type: 'required', message: 'Participant count is required' },
        { type: 'range', min: 3, message: 'At least 3 participants are required' },
        { type: 'range', max: 10, message: 'Maximum 10 participants allowed' },
      ],
    },
  ]);

  protected onSave(): void {
    if (!this.form()?.instance.validate().isValid) {
      return;
    }

    this.save.emit(this.formData());
  }

  protected close(): void {
    this.visibleChange.emit(false);
  }

  resetForm(): void {
    const defaultFormData = createEmptyFormData();
    this.formData.set(defaultFormData);
  }
}
