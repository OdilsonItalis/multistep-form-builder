import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface StarterFormState {
  activity: 1.2 | 1.375 | 1.55 | 1.725 | null;
  fitnessGoal: 'lose' | 'maintain' | 'gain' | null;
  weight: number | null;
  height: number | null;
  dateOfBirth: string | null;
  unitSystem: 'metric' | 'imperial' | null;
  sex: 'male' | 'female' | null;
  step: number;
  onlineCoachingInterest: boolean;
}

const initialState: StarterFormState = {
  activity: null,
  fitnessGoal: null,
  weight: null,
  height: null,
  dateOfBirth: null,
  unitSystem: null,
  sex: null,
  step: 1,
  onlineCoachingInterest: false
};

export const starterFormSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    changeUnitSystem: (state, action: PayloadAction<'metric' | 'imperial'>) => {
      state.unitSystem = action.payload;
    },
    changeActivity: (
      state,
      action: PayloadAction<1.2 | 1.375 | 1.55 | 1.725>
    ) => {
      state.activity = action.payload;
    },
    changeFitnessGoal: (
      state,
      action: PayloadAction<'lose' | 'maintain' | 'gain'>
    ) => {
      state.fitnessGoal = action.payload;
    },
    changeWeight: (state, action: PayloadAction<number>) => {
      state.weight = action.payload;
    },
    changeHeight: (state, action: PayloadAction<number>) => {
      state.height = action.payload;
    },
    changeDateOfBirth: (state, action: PayloadAction<string>) => {
      state.dateOfBirth = action.payload;
    },
    changeSex: (state, action: PayloadAction<'male' | 'female'>) => {
      state.sex = action.payload;
    },
    changeStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    changeOnlineCoachingInterest: (state, action: PayloadAction<boolean>) => {
      state.onlineCoachingInterest = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  changeActivity,
  changeFitnessGoal,
  changeWeight,
  changeHeight,
  changeDateOfBirth,
  changeSex,
  changeStep,
  changeOnlineCoachingInterest,
  changeUnitSystem
} = starterFormSlice.actions;

export default starterFormSlice.reducer;
