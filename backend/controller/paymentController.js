import pool from '../database/db.js';
import paypal from '../helper/paypal.js';
import redisClient from '../database/Redis.js';
import { io , connectedUsers } from '../index.js';

export const holdSeats = async (req, res) => {
  const { show_id, seats, userId } = req.body;

  try {
    for (const seat of seats) {
      const redisKey = `hold:${show_id}:${seat}`;
      const existingHold = await redisClient.get(redisKey);

      if (existingHold) {
        return res.status(409).json({ message: `Seat ${seat} is already held.` });
      }

      await redisClient.setEx(redisKey, 300, userId);
    }

    res.status(200).json({ message: "Seats held successfully for 5 minutes." });
  } catch (err) {
    res.status(500).json({ message: "Error holding seats", error: err.message });
  }
};

export const createBooking = async (req, res) => {
  const { userId, showId, selectedSeats, totalAmount } = req.body;
  const seatIds = selectedSeats.map(seat => seat.seat_id);
  const seatNumbers = selectedSeats.map(seat => seat.seat_number);

  try {
    // Begin database transaction
    await pool.query('BEGIN');

    // Step 1: Verify seat holds in Redis
    for (const seat of seatNumbers) {
      const redisKey = `hold:${showId}:${seat}`;
      const heldBy = await redisClient.get(redisKey);

      if (heldBy !== userId.toString()) {
        await pool.query('ROLLBACK');
        return res.status(409).json({ 
          success: false, 
          message: `Seat ${seat} is not held by you or hold expired.` 
        });
      }
    }

    // Step 2: Lock and verify seat availability in database
    for (const seat of seatNumbers) {
      const lockQuery = `
        SELECT * FROM seats 
        WHERE show_id = $1 AND seat_number = $2 
        FOR UPDATE
      `;
      const seatResult = await pool.query(lockQuery, [showId, seat]);

      if (seatResult.rowCount === 0 || seatResult.rows[0].status !== "available") {
        await pool.query('ROLLBACK');
        return res.status(409).json({ 
          success: false, 
          message: `Seat ${seat} is already booked or invalid.` 
        });
      }
    }

    // Step 3: Create PayPal payment
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

    // Step 4: Process PayPal payment
    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        await pool.query('ROLLBACK');
        console.error('PayPal error:', error);
        return res.status(500).json({ 
          success: false, 
          message: "Payment processing failed" 
        });
      }

      try {
        const approvalURL = payment.links.find(link => link.rel === "approval_url").href;
        const paymentId = payment.id;

        // Step 5: Record payment in database
        await pool.query(
          `INSERT INTO payment (transaction_id, amount, status)
           VALUES ($1, $2, 'pending')`,
          [paymentId, totalAmount]
        );

        // Step 6: Book seats and associate with payment
        const bookingIds = [];
        for (const seat of selectedSeats) {
          // Update seat status to 'booked'
          await pool.query(
            `UPDATE seats SET status = 'booked' 
             WHERE show_id = $1 AND seat_number = $2`,
            [showId, seat.seat_number]
          );

          // Create booking record
          const bookingResult = await pool.query(
            `INSERT INTO bookings (user_id, show_id, seat_id, transaction_id)
             VALUES ($1, $2, $3, $4)
             RETURNING booking_id`,
            [userId, showId, seat.seat_id, paymentId]
          );
          bookingIds.push(bookingResult.rows[0].booking_id);
        }

        // Step 7: Cleanup Redis holds
        for (const seat of seatNumbers) {
          const redisKey = `hold:${showId}:${seat}`;
          await redisClient.del(redisKey);
        }

        // Commit transaction
        await pool.query('COMMIT');

        res.status(201).json({
          success: true,
          approvalURL,
          paymentId,
          bookingIds,
        });

      } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Booking error:', err);
        res.status(500).json({ 
          success: false, 
          message: "Booking creation failed" 
        });
      }
    });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Transaction error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Transaction processing failed" 
    });
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
