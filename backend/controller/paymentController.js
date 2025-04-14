// const paypal = require('@paypal/checkout-server-sdk');
// const clientId = 'YOUR_CLIENT_ID';
// const clientSecret = 'YOUR_CLIENT_SECRET';
// let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// let paypalClient = new paypal.core.PayPalHttpClient(environment);

// exports.createPayment = async (req, res) => {
//   const { amount } = req.body;
//   const request = new paypal.orders.OrdersCreateRequest();
//   request.prefer("return=representation");
//   request.requestBody({
//     intent: "CAPTURE",
//     purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
//   });
//   try {
//     const order = await paypalClient.execute(request);
//     res.status(200).json({ id: order.result.id });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.capturePayment = async (req, res) => {
//   const { orderId } = req.body;
//   const request = new paypal.orders.OrdersCaptureRequest(orderId);
//   request.requestBody({});
//   try {
//     const capture = await paypalClient.execute(request);
//     res.status(200).json({ message: 'Payment captured successfully', capture });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.refundPayment = async (req, res) => {
//   const { captureId } = req.body;
//   const request = new paypal.payments.CapturesRefundRequest(captureId);
//   request.requestBody({});
//   try {
//     const refund = await paypalClient.execute(request);
//     res.status(200).json({ message: 'Refund successful', refund });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 📁 routes/bookingRoutes.js
// const express = require('express');
// const router = express.Router();
// const bookingController = require('../controllers/bookingController');
// const paymentController = require('../controllers/paymentController');

// router.post('/hold', bookingController.holdSeats);
// router.post('/confirm', bookingController.confirmBooking);
// router.post('/create-payment', paymentController.createPayment);
// router.post('/capture-payment', paymentController.capturePayment);
// router.post('/refund', paymentController.refundPayment);

// module.exports = router;

// // 📁 server.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const cron = require('node-cron');
// const bookingController = require('./controllers/bookingController');
// const bookingRoutes = require('./routes/bookingRoutes');
// const app = express();

// app.use(bodyParser.json());
// app.use('/api/booking', bookingRoutes);

// cron.schedule('*/1 * * * *', bookingController.releaseExpiredSeats);

// app.listen(5000, () => console.log('Server running on port 5000'));


import axios from 'axios';

export const createPayment = async (req, res) => {
  const { amount } = req.body;

  try {
    // Get access token from PayPal
    const { data: { access_token } } = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_SECRET
        }
      }
    );

    // Create order
    const order = await axios.post(
      'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount,
          }
        }]
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    res.json(order.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment creation failed' });
  }
};

export const capturePayment = async (req, res) => {
  const { orderId } = req.body;

  try {
    const { data: { access_token } } = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      'grant_type=client_credentials',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_SECRET,
        }
      }
    );

    const capture = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    res.json({ message: 'Payment Captured Successfully!', capture });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment capture failed' });
  }
};
