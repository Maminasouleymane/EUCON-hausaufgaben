import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

export interface Participant {
  id: number;
  name: string;
  email: string;
  role: string;
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
    validationRules: [{ type: 'required' }],
  },
];
