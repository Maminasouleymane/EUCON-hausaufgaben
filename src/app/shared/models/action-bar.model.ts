import { ButtonStyle, ButtonType } from 'devextreme/common';

export interface ActionBarAction {
  label: string;
  icon?: string;
  type?: ButtonType;
  stylingMode?: ButtonStyle;
  onClick: () => void;
}
