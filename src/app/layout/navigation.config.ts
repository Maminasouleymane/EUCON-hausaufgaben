export interface NavItem {
  path: string;
  text: string;
  icon: string;
}

export const NAVIGATION: NavItem[] = [
  { path: 'events', text: 'Events', icon: 'event' },
  { path: 'venues', text: 'Venues', icon: 'map' },
  { path: 'invoices', text: 'Invoices', icon: 'money' },
];
