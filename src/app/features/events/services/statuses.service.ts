import { lastValueFrom, of } from 'rxjs';

import { EventStatus } from '../models/event.model';
import { Injectable } from '@angular/core';
import { STATUSES } from '../models/constant';

@Injectable({ providedIn: 'root' })
export class StatusesService {
  // TODO: replace with an HTTP call once a real backend exists.
  getStatuses(): Promise<EventStatus[]> {
    return lastValueFrom(of(STATUSES));
  }
}
