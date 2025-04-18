import pool from '../database/db.js';
import paypal from '../helper/paypal.js';
import { io , connectedUsers } from '../index.js';


export const createBooking = async (req, res) => {
  try {
    const { userEmail, showId, selectedSeats, totalAmount } = req.body;

    // Extract seat IDs from selectedSeats
    const seatIds = selectedSeats.map(seat => seat.seat_id);

    // Begin database transaction
    await pool.query('BEGIN');

    // Step 1: Create PayPal payment
    const create_payment_json = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: "http://localhost:5173/user/paypal-return",
        cancel_url: "http://localhost:5173/user/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: selectedSeats.map(seat => ({
              name: `Seat ${seat.seat_number} - ${seat.seat_category}`,
              sku: seat.seat_id.toString(),
              price: seat.price.toFixed(2),
              currency: "USD",
              quantity: 1,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Event ticket booking",
        },
      ],
    };

    // Call PayPal to create the payment
    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        await pool.query('ROLLBACK');
        console.log(error);
        return res.status(500).json({ success: false, message: "PayPal error" });
      } else {
        const approvalURL = payment.links.find(link => link.rel === "approval_url").href;

        // Step 2: Insert payment record into payment table
        const paymentId = payment.id;
        await pool.query(
          `INSERT INTO payment (transaction_id, amount)
           VALUES ($1, $2)`,
          [paymentId, totalAmount]
        );

        // Step 3: Insert bookings and associate with the payment
        const bookingIds = [];
        for (let seatId of seatIds) {
          const bookingResult = await pool.query(
            `INSERT INTO bookings (user_id, show_id, seat_id, transaction_id)
             VALUES ($1, $2, $3, $4)
             RETURNING booking_id`,
            [userEmail, showId, seatId, paymentId]
          );
          bookingIds.push(bookingResult.rows[0].booking_id);
        }

        // Commit the transaction after everything is successful
        await pool.query('COMMIT');

        // Send the response with the PayPal approval URL
        res.status(201).json({
          success: true,
          approvalURL,
          paymentId,
          bookingIds,
        });
      }
    });
  } catch (e) {
    await pool.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ success: false, message: "Booking creation failed" });
  }
};




export const capturePayment = async (req, res) => {
  const { paymentId, PayerID , id } = req.body;

  try {
    // Step 1: Capture the payment using PayPal SDK
    paypal.payment.execute(paymentId, { payer_id: PayerID }, async (error, payment) => {
      if (error) {
        console.error('PayPal Error:', error.response);
        return res.status(500).json({ message: 'Payment capture failed' });
      }

      // console.log('PayPal Payment Response:', payment);

      try {
        await pool.query('BEGIN');

        // Step 2: Update payment status to 'paid'
        await pool.query(
          `UPDATE payment
           SET status = 'paid'
           WHERE transaction_id = $1`,
          [paymentId]
        );

        // Step 3: Update all bookings with this transaction to 'paid'
        const result = await pool.query(
          `UPDATE bookings
           SET payment_status = 'paid'
           WHERE transaction_id = $1
           RETURNING seat_id`,
          [paymentId]
        );

        const seatIds = result.rows.map(row => row.seat_id);

        // Step 4: Update seat status to 'booked'
        if (seatIds.length > 0) {
          await pool.query(
            `UPDATE seats
             SET status = 'booked'
             WHERE seat_id = ANY($1::int[])`,
            [seatIds]
          );
        }

        await pool.query('COMMIT');

        res.status(200).json({
          message: 'Payment captured, bookings and seat status updated',
          transaction_id: paymentId,
          seatIds,
        });

        const socketId = connectedUsers.get(id);
        if (socketId) {
          io.to(socketId).emit('ticket-booked', {
            message: 'Your ticket has been successfully booked!',
            transaction_id: paymentId
          });
        }

        
      } catch (dbError) {
        await pool.query('ROLLBACK');
        console.error('Database Error:', dbError);
        res.status(500).json({ message: 'Database update failed after payment capture' });
      }
    });
  } catch (err) {
    console.error('Unexpected Error:', err);
    res.status(500).json({ message: 'Unexpected error during payment capture' });
  }
};
