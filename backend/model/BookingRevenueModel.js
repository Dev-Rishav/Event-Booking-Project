import pool from "../database/db.js";

const Booking = {

    getAllUserWithBooking: async () => {
        const query = "SELECT * FROM bookings";
        const result = await pool.query(query);
        return result.rows[0];
    },

    getBookingDetailsByBookId: async (booking_id) => {
        const query = `SELECT 
                        b.booking_id, 
                        b.user_id, 
                        u.name AS user_name,
                        u.email AS user_email,
                        b.event_id, 
                        e.title AS event_title,
                        e.date AS event_date,
                        e.venue_id,
                        v.name AS venue_name,
                        b.seat_numbers, 
                        b.total_amount, 
                        b.payment_status, 
                        b.booking_status, 
                        b.created_at
                        FROM bookings b
                        JOIN users u ON b.user_id = u.user_id
                        JOIN events e ON b.event_id = e.event_id
                        JOIN venues v ON e.venue_id = v.venue_id
                        WHERE b.booking_id = $1;`;
        const result = await pool.query(query, [booking_id]);
        return result.rows;
    },

    getTotalRevenue: async () => {
        const query = `SELECT SUM(total_price) AS total_revenue
                        FROM bookings 
                        WHERE payment_status = 'Paid'`;
        const result = await pool.query(query);
        return result.rows[0];
    },

    getTotalRevenueByEvent: async (event_id) => {
        const query = `SELECT SUM(total_price) AS total_revenue
                        FROM bookings
                        WHERE payment_status = 'Paid' AND event_id = $1`;
        const result = await pool.query(query, [event_id]);
        return result.rows[0];
    },

    getTotalRevenueByVenue: async () => {
        const query = `SELECT v.name AS venue_name, SUM(b.total_amount) AS total_revenue
                        FROM bookings b
                        JOIN events e ON b.event_id = e.event_id
                        JOIN venues v ON e.venue_id = v.venue_id
                        WHERE b.payment_status = 'Paid'
                        GROUP BY v.name
                        ORDER BY total_revenue DESC`;
        const result = await pool.query(query);
        return result.rows[0];
    },

    // getTotalRevenueByCategory: async () => {
    //     const query = `SELECT 
    // c.category_name, 
    // SUM(b.total_amount) AS total_revenue
    // FROM bookings b
    // JOIN events e ON b.event_id = e.event_id
    // JOIN category c ON e.category_id = c.category_id
    // WHERE b.payment_status = 'Paid'
    // GROUP BY c.category_name
    // ORDER BY total_revenue DESC`;
    //     const result = await pool.query(query);
    //     return result.rows[0];
    // },
}

export default Booking;