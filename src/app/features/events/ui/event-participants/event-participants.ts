import { Component, computed, inject, input } from '@angular/core';

import { DataGrid } from '../../../../shared/ui/data-grid/data-grid';
import { PARTICIPANTS_COLUMNS } from '../../models/participant.model';
import { ParticipantsService } from '../../services/participants.service';

@Component({
  selector: 'app-event-participants',
  imports: [DataGrid],
  templateUrl: './event-participants.html',
  styleUrl: './event-participants.scss',
})
export class EventParticipants {
  private readonly participantsService = inject(ParticipantsService);

  readonly eventId = input.required<number>();

  protected readonly columns = PARTICIPANTS_COLUMNS;
  protected readonly dataSource = computed(() =>
    this.participantsService.createDataSource(this.eventId()),
  );
  protected readonly storageKey = computed(() => `participants-grid-${this.eventId()}`);
}
