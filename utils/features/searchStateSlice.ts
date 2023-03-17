import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  ingredientsSearchState: string;
  recipeSearchState: string;
  usersSearchState: string;
  mealplanSearchState: string;
  unreadMessages: number;
}

const initialState: SearchState = {
  ingredientsSearchState: '',
  recipeSearchState: '',
  usersSearchState: '',
  mealplanSearchState: '',
  unreadMessages: 0
};

export const searchStateSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    changeIngredientSearchState: (state, action: PayloadAction<string>) => {
      state.ingredientsSearchState = action.payload;
    },
    changeRecipeSearchState: (state, action: PayloadAction<string>) => {
      state.recipeSearchState = action.payload;
    },
    changeUsersSearchState: (state, action: PayloadAction<string>) => {
      state.usersSearchState = action.payload;
    },
    updateUnreadMessages: (state, action: PayloadAction<number>) => {
      state.unreadMessages = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  changeIngredientSearchState,
  changeRecipeSearchState,
  changeUsersSearchState,
  updateUnreadMessages
} = searchStateSlice.actions;

export default searchStateSlice.reducer;
