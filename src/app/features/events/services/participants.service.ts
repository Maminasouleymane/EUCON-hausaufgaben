import { Injectable } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';

import { Participant } from '../models/participant.model';
import { generateParticipants, simulateNetwork } from '../utils/helpers';

@Injectable({ providedIn: 'root' })
export class ParticipantsService {
  private readonly participantsByEvent = new Map<number, Participant[]>();

  createDataSource(eventId: number): CustomStore<Participant, number> {
    return new CustomStore<Participant, number>({
      key: 'id',
      load: () => simulateNetwork(this.getParticipants(eventId)),
      insert: (values) => this.insert(eventId, values),
      remove: (key) => this.remove(eventId, key),
    });
  }

  getParticipants(eventId: number): Participant[] {
    let participants = this.participantsByEvent.get(eventId);
    if (!participants) {
      participants = generateParticipants();
      this.participantsByEvent.set(eventId, participants);
    }
    return participants;
  }

  seedParticipants(eventId: number, count: number): void {
    this.participantsByEvent.set(eventId, generateParticipants(count));
  }

  private insert(eventId: number, values: Omit<Participant, 'id'>): Promise<Participant> {
    const participants = this.getParticipants(eventId);
    // The 0 seed keeps this safe if participants is ever empty (Math.max() alone is -Infinity).
    const id = Math.max(0, ...participants.map((participant) => participant.id)) + 1;
    const participant: Participant = { id, ...values };
    participants.push(participant);
    return simulateNetwork(participant);
  }

  private remove(eventId: number, key: number): Promise<void> {
    const participants = this.getParticipants(eventId);
    const index = participants.findIndex((participant) => participant.id === key);
    if (index !== -1) {
      participants.splice(index, 1);
    }
    return simulateNetwork(undefined);
  }
}
