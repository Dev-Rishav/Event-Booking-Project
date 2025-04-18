// src/redux/adminActions.js or same file
import { setLoading, setUsers, setOrganizers, setError } from './adminSlice';
import axios from 'axios';

const BASE_URL = 'http://localhost:8001/api/admin';

export const fetchAllUsers = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`${BASE_URL}/users`);
    dispatch(setUsers(res.data.result));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || 'Failed to fetch users'));
  }
  dispatch(setLoading(false));
};

export const fetchAllOrganizers = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`${BASE_URL}/organizers`);
    dispatch(setOrganizers(res.data.result));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || 'Failed to fetch organizers'));
  }
  dispatch(setLoading(false));
};
