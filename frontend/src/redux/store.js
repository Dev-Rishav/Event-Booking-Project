import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../redux/slices/adminslice/adminSlice';

export const store = configureStore({
  reducer: {
    admin : adminReducer,
  },
})