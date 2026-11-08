import { Injectable } from '@angular/core';
import { lastValueFrom, of } from 'rxjs';

import { STATUSES } from '../models/constant';
import { EventStatus } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class StatusesService {
  // TODO: replace with an HTTP call once a real backend exists.
  getStatuses(): Promise<EventStatus[]> {
    return lastValueFrom(of(STATUSES));
  }
}
