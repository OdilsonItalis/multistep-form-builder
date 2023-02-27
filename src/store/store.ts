import { combineReducers } from 'redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import { formsReducer } from './formsReducer/reducer';

const reducers = combineReducers({
    formsReducer,
});

const store = createStore(reducers, applyMiddleware(thunk));
export type RootState = ReturnType<typeof store.getState>
  
export default store;
