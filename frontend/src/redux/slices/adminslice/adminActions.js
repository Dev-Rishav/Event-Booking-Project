// src/redux/adminActions.js or same file
import { setLoading, setUsers, setOrganizers, setError, setApprovalUrl, setSuccess , setPlan } from './adminSlice';
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


export const createOrganizerSubscription = (email, price, plan_id, start_date, end_date) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${BASE_URL}/organizer/create-subscription`, {
      email, price, plan_id, start_date, end_date
    });
    dispatch(setApprovalUrl(response.data.approvalUrl));
    dispatch(setSuccess(true));
    dispatch(setError(null));

    if (response.data.success && response.data.approvalURL) {
      dispatch(setApprovalUrl(response.data.approvalURL));
    } else {
      throw new Error("Payment initiation failed.");
    }
  } catch (err) {
    dispatch(setError(err.response?.data?.error || 'Failed to create subscription'));
  }
  dispatch(setLoading(false));
};

export const captureOrganizerSubscription = (paymentId, PayerID, email) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${BASE_URL}/organizer/capture-subscription`, {
      paymentId,
      PayerID,
      email,
    });
    dispatch(setSuccess(true));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || 'Failed to capture subscription'));
  }
  dispatch(setLoading(false));
};

export const fetchSubscriptionPlan = (plan_id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`http://localhost:8001/api/get-plan/${plan_id}`);
    localStorage.setItem('plan', JSON.stringify(res.data.result));
    dispatch(setPlan(res.data.result));
    dispatch(setLoading(false));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || 'Failed to fetch plan'));
  }
};