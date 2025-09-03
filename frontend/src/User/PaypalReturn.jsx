// PaypalReturn.jsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUser  } from '../User/UserContext/UserContext';
import axios from 'axios';
import Cookies from 'js-cookie';

import { API_ENDPOINTS } from "../config/api.js";

const PaypalReturn = () => {
  const id = Cookies.get("id");
  const { selectedSeats  } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storedShow = localStorage.getItem("selectedUserShow");
  const selectedUserShow = storedShow ? JSON.parse(storedShow) : null;
  const show_id = selectedUserShow?.show_id;



  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const PayerID = searchParams.get('PayerID');

    const capturePayment = async () => {
      try {
        const res = await axios.post(API_ENDPOINTS.BOOKING.CAPTURE_PAYMENT, {
          paymentId,
          PayerID,
          selectedSeats,
          show_id,
          id
        });

        alert("Payment successful!");
        navigate("/user/bookings");
      } catch (err) {
        alert("Payment failed. Please contact support.");
        console.log("Capture error:", err);
      }
    };

    if (paymentId && PayerID) {
      capturePayment();
    }
  }, [searchParams, navigate]);

  return <div>Processing your payment...</div>;
};

export default PaypalReturn;
