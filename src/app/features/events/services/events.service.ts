import { inject, Injectable } from '@angular/core';
import type { LoadOptions, LoadResult } from 'devextreme/common/data';
import CustomStore from 'devextreme/data/custom_store';
import query from 'devextreme/data/query';

import { EVENT_COUNT } from '../models/constant';
import { EventRecord } from '../models/event.model';
import { ParticipantSummaryItem } from '../models/participant.model';
import { generateEvents, simulateNetwork, toSortDescriptors } from '../utils/helpers';
import { ParticipantsService } from './participants.service';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly participantsService = inject(ParticipantsService);
  private readonly events = generateEvents(
    EVENT_COUNT,
    (id) => this.participantsService.getParticipants(id).length,
  );

  getParticipantsByStatus(filter?: unknown[] | null): Promise<ParticipantSummaryItem[]> {
    return simulateNetwork(this.summarizeParticipantsBy((event) => event.status, filter));
  }

  getParticipantsByLocation(filter?: unknown[] | null): Promise<ParticipantSummaryItem[]> {
    return simulateNetwork(this.summarizeParticipantsBy((event) => event.location, filter));
  }

  createDataSource(): CustomStore<EventRecord, number> {
    return new CustomStore<EventRecord, number>({
      key: 'id',
      load: (options) => this.load(options),
      update: (key, values) => this.update(key, values),
      insert: (values) => this.insert(values),
    });
  }

  private update(key: number, values: Partial<EventRecord>): Promise<EventRecord> {
    const event = this.events.find((item) => item.id === key);
    if (!event) {
      return Promise.reject(new Error(`Event ${key} not found`));
    }

    Object.assign(event, values);
    return simulateNetwork(event);
  }

  private insert(values: Omit<EventRecord, 'id'>): Promise<EventRecord> {
    // The 0 seed keeps this safe if this.events is ever empty (Math.max() alone is -Infinity).
    const id = Math.max(0, ...this.events.map((event) => event.id)) + 1;
    const event: EventRecord = { id, ...values };

    this.events.unshift(event);
    return simulateNetwork(event);
  }

  private async load(options: LoadOptions<EventRecord>): Promise<LoadResult<EventRecord>> {
    let data = this.events;

    const searchValue =
      typeof options.searchValue === 'string' ? options.searchValue.trim().toLowerCase() : '';
    if (searchValue) {
      data = data.filter((event) =>
        [event.name, event.location, event.status, String(event.participantCount)].some((value) =>
          value.toLowerCase().includes(searchValue),
        ),
      );
    }

    if (options.filter) {
      data = query(data).filter(options.filter).toArray();
    }

    // Captured after search/filter but before sort/paging, so it reflects the full matched count.
    const totalCount = data.length;

    let result = query(data);
    if (options.sort) {
      const [first, ...rest] = toSortDescriptors(options.sort);
      result = result.sortBy(first.selector, first.desc ?? false);
      for (const { selector, desc } of rest) {
        result = result.thenBy(selector, desc ?? false);
      }
    }

    const page = result.slice(options.skip ?? 0, options.take ?? data.length).toArray();

    return simulateNetwork({ data: page, totalCount });
  }

  private summarizeParticipantsBy(
    selector: (event: EventRecord) => string,
    filter?: unknown[] | null,
  ): ParticipantSummaryItem[] {
    const data = filter ? query(this.events).filter(filter).toArray() : this.events;
    const totals = new Map<string, number>();

    for (const event of data) {
      const category = selector(event);
      totals.set(category, (totals.get(category) ?? 0) + event.participantCount);
    }

    return [...totals.entries()].map(([category, participantCount]) => ({
      category,
      participantCount,
    }));
  }
}
