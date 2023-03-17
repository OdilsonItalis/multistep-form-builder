import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FormConfigInterface } from './formConfigSlice';

interface CustomFormInterface {
  step: number;
  activity?: 'sedentary' | 'lightly' | 'active' | 'veryActive' | null;
  fitnessGoal?: 'lose' | 'maintain' | 'gain' | null;
  fullName: string | null;
  weight?: number | null;
  height?: number | null;
  dateOfBirth?: string | null;
  sex?: 'male' | 'female' | null;
  long?: number | null;
  lat?: number | null;
  theme: string | null;
  email: string | null;
  phoneNumber: string | null;
  formConfiguration?: FormConfigInterface[];
  [index: string]: unknown;
}

const initialState: CustomFormInterface = {
  activity: null,
  fitnessGoal: null,
  weight: null,
  height: null,
  email: null,
  dateOfBirth: null,
  sex: null,
  step: 0,
  onlineCoachingInterest: false,
  long: null,
  lat: null,
  formConfiguration: [],
  theme: null,
  phoneNumber: null,
  fullName: null
};

export const customFormSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    changeField: (
      state,
      action: PayloadAction<{ key: string; value: unknown }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    changeMultipleFields: (
      state,
      action: PayloadAction<{ key: string; value: unknown }[]>
    ) => {
      action.payload.forEach((obj) => {
        state[obj.key] = obj.value;
      });
    },
    setNewCustomFormState: (
      state,
      action: PayloadAction<CustomFormInterface>
    ) => {
      return action.payload;
    },
    addFormConfig: (state, action: PayloadAction<FormConfigInterface[]>) => {
      state.formConfiguration = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  changeField,
  changeMultipleFields,
  setNewCustomFormState,
  addFormConfig
} = customFormSlice.actions;

export default customFormSlice.reducer;
