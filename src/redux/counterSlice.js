// redux/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCount: 0,
  inactiveCount: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setActiveCount: (state, action) => {
      state.activeCount = action.payload;
    },
    setInactiveCount: (state, action) => {
      state.inactiveCount = action.payload;
    },
  },
});

export const { setActiveCount, setInactiveCount } = counterSlice.actions;

export default counterSlice.reducer;
