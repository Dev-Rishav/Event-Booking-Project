import pool from "../database/db.js";

const Event = {

    getEventsByOrganizer: async (organizer_id) => {
        const query = "SELECT * FROM events WHERE organizer_id = $1";
        const result = await pool.query(query, [organizer_id]);
        return result.rows;
    },

    createEvent: async (eventData) => {
        const { title, description, category , event_date , organizer_id, image , status } = eventData;
        
        const query = `
            INSERT INTO events (title, description, category, event_date, organizer_id, image , status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
    
        const values = [title, description, category,event_date, organizer_id, image, status || 'active'];
    
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    createShowForAnEvent: async(showData) => {
        const { event_id , venue_id , start_time , end_time , total_seats , show_date } = showData;

        const query = `
        INSERT INTO shows (event_id , venue_id , start_time , end_time , total_seats , show_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [event_id , venue_id , start_time , end_time , total_seats , show_date];

        const result = await pool.query(query , values);
        return result.rows[0];
    },

    getAllShowsOfAnEvent: async(event_id) => {
        const query = `SELECT * FROM shows WHERE event_id = $1`;
        const result = await pool.query(query , [event_id]);
        return result.rows;
    },

    getEventsByCategoryAndOrganizer: async (category, organizer_id) => {
        const query = "SELECT * FROM events WHERE category = $1 AND organizer_id = $2";
        const result = await pool.query(query, [category, organizer_id]);
        return result.rows;
    },
    

    getEventsByCityAndOrganizer: async (city, organizer_id) => {
        // const query = `
        //     SELECT e.* 
        //     FROM events e
        //     JOIN venues v ON e.venue_id = v.venue_id
        //     WHERE v.city = $1 AND e.organizer_id = $2
        // `;
        // const result = await pool.query(query, [city, organizer_id]);
        // return result.rows;
    },

    getEventsByCity: async (city) => {
        const query = `
            SELECT e.*
            FROM events e
            JOIN shows s ON e.event_id = s.event_id
            JOIN venues v ON s.venue_id = v.venue_id
            WHERE v.city = $1;
        `;
        const result = await pool.query(query, [city]);
        return result.rows;
    },

    getEventsByCategory: async(category) => {
        const query = `
        SELECT * 
        FROM events 
        WHERE category = $1;
        `;
        const result = await pool.query(query , [category]);
        return result.rows;
    },
    

    getEventsById: async (event_id) => {
        const query = "SELECT * FROM events WHERE event_id = $1";
        const result = await pool.query(query, [event_id]);
        return result.rows;
    },
    
    getTopEventByLikes: async() => {
        const query = `SELECT e.event_id, e.title, e.description, e.category, e.date, e.duration, v.name AS venue_name, v.city, e.likes_count
                       FROM events e
                       JOIN venues v ON e.venue_id = v.venue_id
                       WHERE v.city = 'New York'
                       ORDER BY e.likes_count DESC
                       LIMIT 2`;
        const result = await pool.query(query , [city]);
        return result.rows;
    },

    getVenueById: async (venue_id) => {
        const query = "SELECT city FROM venues WHERE venue_id = $1";
        const values = [venue_id];

        const result = await pool.query(query, values);
        return result.rows[0]; // return single venue object
    },

    insertGeneratedSeats: async(generatedSeats) => {
            try {
              const insertQuery = `
                INSERT INTO seats (seat_number, show_id, seat_category, status, price)
                VALUES ($1, $2, $3, $4, $5)
              `;
          
              for (const seat of generatedSeats) {
                await pool.query(insertQuery, [
                  seat.seat_number,
                  seat.show_id,
                  seat.seat_category,
                  seat.status || 'available', // fallback to 'available'
                  seat.price
                ]);
              }
          
              return { message: `${seats.length} seats inserted successfully.` };
            } catch (err) {
              console.error("Error inserting seats:", err);
            }
    }

}

export default Event 