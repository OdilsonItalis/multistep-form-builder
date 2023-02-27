import { createSlice } from '@reduxjs/toolkit';
import { FormModel } from '../../models/form';

const initialState: { totalForms: FormModel[]; selectedForm: FormModel | unknown } = {
  totalForms: [],
  selectedForm: {}
};

export const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    createNewForm: (state, action) => {
      state.totalForms = [...state.totalForms, action.payload];
      state.selectedForm = action.payload;
    }
  }
});

export const { createNewForm } = formsSlice.actions;

export default formsSlice.reducer;
