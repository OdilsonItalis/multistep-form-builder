import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
