// src/redux/adminActions.js or same file
import { setLoading, setUsers, setOrganizers, setError, setApprovalUrl, setSuccess , setPlan , setPlans } from './adminSlice';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api.js';

export const fetchAllUsers = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(API_ENDPOINTS.ADMIN.USERS);
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
    const res = await axios.get(API_ENDPOINTS.ADMIN.ORGANIZERS);
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
    const response = await axios.post(API_ENDPOINTS.ADMIN.SUBSCRIPTION.CREATE, {
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
    const response = await axios.post(API_ENDPOINTS.ADMIN.SUBSCRIPTION.CAPTURE, {
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
    const res = await axios.get(API_ENDPOINTS.ADMIN.PLANS.GET_BY_ID(plan_id));
    localStorage.setItem('plan', JSON.stringify(res.data.result));
    dispatch(setPlan(res.data.result));
    dispatch(setLoading(false));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || 'Failed to fetch plan'));
  }
};

export const fetchAllSubscriptionPlans = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(API_ENDPOINTS.ADMIN.PLANS.GET_ALL);
    localStorage.setItem('Allplans', JSON.stringify(res.data.result));
    // console.log(res.data.result);
    dispatch(setPlans(res.data.result));
    dispatch(setLoading(false));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || 'Failed to fetch plan'));
  }
};


export const createSubscriptionPlan = (formData) => async(dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(API_ENDPOINTS.ADMIN.PLANS.CREATE, formData);
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Failed to create plan'));
  }
}