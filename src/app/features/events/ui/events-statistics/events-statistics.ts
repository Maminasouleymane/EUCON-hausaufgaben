import { Component, inject, input, resource } from '@angular/core';
import { EventsService } from '@features/events/services/events.service';
import { ErrorState } from '@shared/ui/error-state/error-state';

@Component({
  selector: 'app-events-statistics',
  imports: [ErrorState],
  templateUrl: './events-statistics.html',
  styleUrl: './events-statistics.scss',
})
export class EventsStatistics {
  private readonly eventsService = inject(EventsService);

  readonly filter = input<unknown[] | null>(null);

  protected readonly byStatusResource = resource({
    params: () => this.filter(),
    loader: ({ params }) => this.eventsService.getParticipantsByStatus(params),
    defaultValue: [],
  });

  protected readonly byLocationResource = resource({
    params: () => this.filter(),
    loader: ({ params }) => this.eventsService.getParticipantsByLocation(params),
    defaultValue: [],
  });
}
