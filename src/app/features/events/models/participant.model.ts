import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

import { PARTICIPANT_ROLES } from './constant';

export interface Participant {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ParticipantSummaryItem {
  category: string;
  participantCount: number;
}

export const PARTICIPANTS_COLUMNS: DxDataGridTypes.Column<Participant>[] = [
  {
    dataField: 'name',
    caption: 'Name',
    validationRules: [{ type: 'required' }],
  },
  {
    dataField: 'email',
    caption: 'Email',
    validationRules: [{ type: 'required' }, { type: 'email' }],
  },
  {
    dataField: 'role',
    caption: 'Role',
    lookup: { dataSource: PARTICIPANT_ROLES },
    validationRules: [{ type: 'required' }],
  },
];
