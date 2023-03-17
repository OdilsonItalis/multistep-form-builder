import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  discoveryTabState: number;
  savedTabState: number;
  currentWorkoutDay: string;
  publicProfileTabState: number;
}

const currentDate = new Date();
const dateString = currentDate.toISOString().substring(0, 10);

const initialState: SearchState = {
  discoveryTabState: 1,
  savedTabState: 1,
  currentWorkoutDay: dateString,
  publicProfileTabState: 1
};

export const tabStateSlice = createSlice({
  name: 'tabState',
  initialState,
  reducers: {
    changeDiscoveryTabState: (state, action: PayloadAction<number>) => {
      state.discoveryTabState = action.payload;
    },
    changeSavedTabState: (state, action: PayloadAction<number>) => {
      state.savedTabState = action.payload;
    },
    changeCurrentWorkoutDay: (state, action: PayloadAction<string>) => {
      console.log('this ran');
      console.log(action.payload);
      state.currentWorkoutDay = action.payload;
    },
    changePublicProfileTabState: (state, action: PayloadAction<number>) => {
      state.publicProfileTabState = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  changeDiscoveryTabState,
  changeSavedTabState,
  changeCurrentWorkoutDay,
  changePublicProfileTabState
} = tabStateSlice.actions;

export default tabStateSlice.reducer;
