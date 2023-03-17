import { configureStore } from '@reduxjs/toolkit';
import starterFormReducer from './features/starterFormSlice';
import searchStateReducer from './features/searchStateSlice';
import modalStateReducer from './features/modalStateSlice';
import tabStateReducer from './features/tabStateSlice';
import formConfigReducer from './features/formConfigSlice';
import customFormReducer from './features/customFormSlice';

export const store = configureStore({
  reducer: {
    searchState: searchStateReducer,
    starterForm: starterFormReducer,
    modalState: modalStateReducer,
    tabState: tabStateReducer,
    formConfig: formConfigReducer,
    customForm: customFormReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
