// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationSlice';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    counter: counterReducer,
  },
});

