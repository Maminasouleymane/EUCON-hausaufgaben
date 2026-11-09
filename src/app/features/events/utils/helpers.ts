import { SortDescriptor } from 'devextreme/data';

import {
  ALL,
  ERROR_RATE,
  EVENT_NAMES,
  FILTER_BAR_KEY,
  FilterBarState,
  FIRST_NAMES,
  LAST_NAMES,
  LOCATIONS,
  MAX_LATENCY_MS,
  MAX_PARTICIPANTS,
  MIN_LATENCY_MS,
  MIN_PARTICIPANTS,
  PARTICIPANT_ROLES,
  STATUSES,
} from '../models/constant';
import { DateRange } from '../models/date.model';
import { EventRecord, NewEventFormData } from '../models/event.model';
import { Participant } from '../models/participant.model';

export function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateEvents(
  count: number,
  resolveParticipantCount: (eventId: number) => number,
): EventRecord[] {
  const events: EventRecord[] = [];

  for (let id = 1; id <= count; id++) {
    const date = new Date();
    // Spreads dates across a 2-year window: 365 days back to 365 days ahead of today.
    date.setDate(date.getDate() + Math.floor(Math.random() * 730) - 365);

    events.push({
      id,
      name: `${randomItem(EVENT_NAMES)} #${id}`,
      date,
      location: randomItem(LOCATIONS),
      status: randomItem(STATUSES),
      participantCount: resolveParticipantCount(id),
    });
  }

  return events;
}

export function generateParticipants(count?: number): Participant[] {
  const resolvedCount =
    count ??
    MIN_PARTICIPANTS + Math.floor(Math.random() * (MAX_PARTICIPANTS - MIN_PARTICIPANTS + 1));
  const participants: Participant[] = [];

  for (let id = 1; id <= resolvedCount; id++) {
    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);

    participants.push({
      id,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      role: randomItem(PARTICIPANT_ROLES),
    });
  }

  return participants;
}

// Mocks a backend round-trip: random latency plus an ERROR_RATE chance of rejecting.
export function simulateNetwork<T>(value: T): Promise<T> {
  const latency = MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < ERROR_RATE) {
        reject(new Error('Simulated backend error'));
      } else {
        resolve(value);
      }
    }, latency);
  });
}

// Normalizes DevExtreme's sort option (string, object, or array of either) into one shape.
export function toSortDescriptors(
  sort: SortDescriptor<EventRecord> | SortDescriptor<EventRecord>[],
): { selector: string; desc?: boolean }[] {
  return (Array.isArray(sort) ? sort : [sort]).map((item) =>
    typeof item === 'string' ? { selector: item } : item,
  ) as { selector: string; desc?: boolean }[];
}

export function createEmptyFormData(): NewEventFormData {
  return { name: '', location: null, status: null, date: null, participantCount: null };
}

export function filterBuilder(
  status: string,
  location: string,
  { start, end }: DateRange,
): unknown[] | null {
  const filters: unknown[][] = [];

  if (status !== ALL) {
    filters.push(['status', '=', status]);
  }
  if (location !== ALL) {
    filters.push(['location', '=', location]);
  }
  if (start) {
    filters.push(['date', '>=', start]);
  }
  if (end) {
    filters.push(['date', '<=', end]);
  }

  // Nests into DevExtreme's [cond, 'and', cond] combined-filter expression shape.
  return filters.reduce<unknown[] | null>((acc, part) => (acc ? [acc, 'and', part] : part), null);
}

export function loadFilterBar(): FilterBarState {
  const empty: FilterBarState = {
    status: ALL,
    location: ALL,
    dateRange: { start: null, end: null },
    search: '',
  };
  try {
    const raw = localStorage.getItem(FILTER_BAR_KEY);
    if (!raw) {
      return empty;
    }
    const s = JSON.parse(raw);
    return {
      status: s.status ?? ALL,
      location: s.location ?? ALL,
      dateRange: {
        start: s.dateRange?.start ? new Date(s.dateRange.start) : null,
        end: s.dateRange?.end ? new Date(s.dateRange.end) : null,
      },
      search: s.search ?? '',
    };
  } catch {
    return empty;
  }
}

export function saveFilterBar(state: FilterBarState): void {
  localStorage.setItem(FILTER_BAR_KEY, JSON.stringify(state));
}
