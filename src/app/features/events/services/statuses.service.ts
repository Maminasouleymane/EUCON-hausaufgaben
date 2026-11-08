import { Observable, of } from 'rxjs';

import { EventStatus } from '../models/event.model';
import { Injectable } from '@angular/core';
import { STATUSES } from '../models/constant';

@Injectable({ providedIn: 'root' })
export class StatusesService {
  // TODO: replace with an HTTP call once a real backend exists.
  getStatuses(): Observable<EventStatus[]> {
    return of(STATUSES);
  }
}
