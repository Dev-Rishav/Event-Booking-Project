// src/redux/adminSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  organizers: [],
  plans : [],
  plan : null ,
  loading: false,
  error: null,
  approvalUrl: null,
  success: false,
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
    setApprovalUrl: (state, action) => {
      state.approvalUrl = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    setPlan: (state, action) => {
      state.plan = action.payload;
    },
    setPlans: (state, action) => {
      state.plan = action.payload;
    },
    resetSubscription: (state) => {
      state.loading = false;
      state.error = null;
      state.approvalUrl = '';
      state.success = false;
    },
  },
});

export const { setLoading, setUsers, setOrganizers, setError , setSuccess , resetSubscription , setApprovalUrl , setPlan , setPlans} = adminSlice.actions;

export default adminSlice.reducer;
