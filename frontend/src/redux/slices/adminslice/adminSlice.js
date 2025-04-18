// src/redux/adminSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  organizers: [],
  loading: false,
  error: null,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setOrganizers: (state, action) => {
      state.organizers = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setUsers, setOrganizers, setError } = adminSlice.actions;

export default adminSlice.reducer;
