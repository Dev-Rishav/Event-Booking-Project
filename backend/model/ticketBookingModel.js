import pool from "../database/db.js";

const Ticket = {

    fetchSeats: async(show_id) => {
        const query = 'SELECT * FROM seats WHERE show_id = $1';
        const result = await pool.query(query , [show_id]);
        return result.rows;
    },

    bookSeat: async(show_id , seat_number) => {
        const query = 'UPDATE seats SET status = $1 WHERE show_id = $2 AND seat_number = $3 AND status = $4';
        const result = await pool.query(query , ['booked', show_id, seat_number, 'available']);
    },

    releaseSeat: async(show_id , seat_number) => {
        const query = 'UPDATE seats SET status = $1 WHERE show_id = $2 AND seat_number = $3';
        const result = await pool.query(query , ['available', show_id, seat_number]);
    },
}

export default Ticket;
