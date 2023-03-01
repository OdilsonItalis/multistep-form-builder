import { ReactElement } from 'react';

export type ButtonProps = {
  themeColor?: string;
  onClickHandler?: () => void;
  type?: 'button' | 'submit' | 'reset';
  classes?: string;
  children: ReactElement | string;
  leftArrow?: boolean;
  radioCicle?: boolean;
  radioChecked?: boolean;
  disabled?: boolean;
};

export type InputProps = {
  value?: string;
  name?: string;
  onChange?: (e: any) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  id?: string; 
  error?: boolean | "";
  label?: string;
}

export type FromLabelProps = {
  children: ReactElement | string;
}
