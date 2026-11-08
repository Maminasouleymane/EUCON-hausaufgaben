import {
  ERROR_RATE,
  EVENT_NAMES,
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
import { EventRecord, NewEventFormData } from '../models/event.model';

import { Participant } from '../models/participant.model';
import { SortDescriptor } from 'devextreme/data';

export function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateEvents(count: number): EventRecord[] {
  const events: EventRecord[] = [];

  for (let id = 1; id <= count; id++) {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 730) - 365);

    events.push({
      id,
      name: `${randomItem(EVENT_NAMES)} #${id}`,
      date,
      location: randomItem(LOCATIONS),
      status: randomItem(STATUSES),
      participantCount: 3 + Math.floor(Math.random() * 8),
    });
  }

  return events;
}

export function generateParticipants(): Participant[] {
  const count =
    MIN_PARTICIPANTS + Math.floor(Math.random() * (MAX_PARTICIPANTS - MIN_PARTICIPANTS + 1));
  const participants: Participant[] = [];

  for (let id = 1; id <= count; id++) {
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
