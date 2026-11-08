import { EventStatus } from './event.model';

export const EVENT_COUNT = 5000;
export const MIN_LATENCY_MS = 100;
export const MAX_LATENCY_MS = 300;
export const ERROR_RATE = 0.05;
export const STATUSES: EventStatus[] = ['planned', 'cancelled', 'done'];
export const LOCATIONS = [
  'Münster',
  'Paris',
  'Atlanta',
  'Toronto',
  'Mexico City',
  'Shanghai',
  'Tokyo',
];
export const EVENT_NAMES = [
  'Trade Fair',
  'Congress',
  'Customer Event',
  'Summer Party',
  'Christmas Party',
  'Workshop',
  'Product Launch',
  'Networking Mixer',
];
export const TABS = ['List', 'Statistics'];

export const MIN_PARTICIPANTS = 3;
export const MAX_PARTICIPANTS = 8;
export const PARTICIPANT_ROLES = ['Organizer', 'Speaker', 'Attendee', 'Staff'];
export const FIRST_NAMES = [
  'Anna',
  'Ben',
  'Clara',
  'David',
  'Elena',
  'Felix',
  'Greta',
  'Hugo',
  'Ines',
  'Jonas',
];
export const LAST_NAMES = [
  'Keller',
  'Brandt',
  'Moser',
  'Fischer',
  'Weber',
  'Schulz',
  'Hoffmann',
  'Becker',
  'Wagner',
  'Richter',
];

export const EVENTS_TABS = ['List', 'Statistics'];
export const ALL = 'All';
