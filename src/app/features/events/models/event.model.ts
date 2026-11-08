export type EventStatus = 'planned' | 'cancelled' | 'done';

export interface EventRecord {
  id: number;
  name: string;
  date: Date;
  location: string;
  status: EventStatus;
  participantCount: number;
}

export interface NewEventFormData {
  name: string;
  location: string | null;
  status: EventStatus | null;
  date: Date | null;
  participantCount: number | null;
}
