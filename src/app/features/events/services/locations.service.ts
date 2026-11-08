import { lastValueFrom, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { LOCATIONS } from '../models/constant';

@Injectable({ providedIn: 'root' })
export class LocationsService {
  // TODO: replace with an HTTP call once a real backend exists.
  getLocations(): Promise<string[]> {
    return lastValueFrom(of(LOCATIONS));
  }
}
