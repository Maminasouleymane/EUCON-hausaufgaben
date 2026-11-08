import { Component, computed, inject, input } from '@angular/core';
import { PARTICIPANTS_COLUMNS } from '@features/events/models/participant.model';
import { ParticipantsService } from '@features/events/services/participants.service';
import { DataGrid } from '@shared/ui/data-grid/data-grid';

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
