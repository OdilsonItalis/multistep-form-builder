import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';

import formsReducer from './slices/formsSlice';

const combinedReducers = combineReducers({
  formsReducer
});

const reducer = (state, action) => {
  let nextState;
  switch (action.type) {
    case HYDRATE:
      nextState = {
        ...state,
        ...action.payload
      };
      return nextState;
    default:
      return combinedReducers(state, action);
  }
};

const makeStore = () =>
  configureStore({
    reducer,
    middleware: [thunkMiddleware]
  });

export const reduxWrapper = createWrapper(makeStore);
