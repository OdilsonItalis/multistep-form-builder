import { FormModel } from '../../models/form';

export const createNewForm = (data: FormModel) => {
  return {
    type: 'createNewForm',
    payload: data
  };
};
