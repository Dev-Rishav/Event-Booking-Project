// src/pages/PayPalReturn.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { captureOrganizerSubscription } from '../../redux/slices/adminslice/adminActions';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PayPalSubscriptionReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get('paymentId');
  const PayerID = searchParams.get('PayerID');
  const email = Cookies.get("id");

  const { loading, error, success } = useSelector((state) => state.admin);

  useEffect(() => {
    if (paymentId && PayerID && email) {
      dispatch(captureOrganizerSubscription(paymentId, PayerID, email));
    }
  }, [dispatch, paymentId, PayerID, email]);

  alert("Subcription Payment successful!");

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/organizer/subscription');
      }, 2000); 
    }
  }, [success, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {loading && <p className="text-lg font-medium text-blue-500">Capturing payment...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600 text-lg font-semibold">Subscription successful! Redirecting...</p>}
    </div>
  );
};

export default PayPalSubscriptionReturn;
