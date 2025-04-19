import pool from "../database/db.js";

const Event = {

    getEventsByOrganizer: async (organizer_id) => {
        const query = "SELECT * FROM events WHERE organizer_id = $1";
        const result = await pool.query(query, [organizer_id]);
        return result.rows;
    },

    createEvent: async (eventData) => {
        const { title, description, category, organizer_id, image , start_date , end_date , venue_id } = eventData;

        const query = `
            INSERT INTO events (title, description, category , organizer_id, image , start_date , end_date , venue_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7 , $8 )
            RETURNING *;
        `;

        const values = [title, description, category, organizer_id, image , start_date , end_date , venue_id || 'active'];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    createShowForAnEvent: async (showData) => {
        const { event_id, venue_id, start_time, end_time, total_seats, show_date } = showData;

        const query = `
        INSERT INTO shows (event_id , venue_id , start_time , end_time , total_seats , show_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [event_id, venue_id, start_time, end_time, total_seats, show_date];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    getAllShowsOfAnEvent: async (event_id) => {
        const query = `SELECT * FROM shows WHERE event_id = $1`;
        const result = await pool.query(query, [event_id]);
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

    getEventsByCategory: async (city, category) => {
        const query = `
          SELECT e.*, v.city
          FROM events e
          JOIN venues v ON e.venue_id = v.venue_id
          WHERE v.city = $1 AND e.category = $2 AND e.status = 'ongoing'
        `;
        const result = await pool.query(query, [city, category]);
        return result.rows;
      },

      getEventsByDateandCity: async (city, event_date) => {
        const query = `
          SELECT e.*, v.city
          FROM events e
          JOIN venues v ON e.venue_id = v.venue_id
          WHERE v.city = $1
            AND $2::timestamp BETWEEN e.start_date AND e.end_date
            AND e.status = 'ongoing'
        `;
        const result = await pool.query(query, [city, event_date]);
        return result.rows;
      },
      


    getEventsById: async (event_id) => {
        const query = "SELECT * FROM events WHERE event_id = $1";
        const result = await pool.query(query, [event_id]);
        return result.rows;
    },

    getTopEventByLikes: async () => {
        const query = `SELECT e.event_id, e.title, e.description, e.category, e.date, e.duration, v.name AS venue_name, v.city, e.likes_count
                       FROM events e
                       JOIN venues v ON e.venue_id = v.venue_id
                       WHERE v.city = 'New York'
                       ORDER BY e.likes_count DESC
                       LIMIT 2`;
        const result = await pool.query(query, [city]);
        return result.rows;
    },

    getVenueById: async (venue_id) => {
        const query = "SELECT city FROM venues WHERE venue_id = $1";
        const values = [venue_id];

        const result = await pool.query(query, values);
        return result.rows[0]; // return single venue object
    },

    likeEvent: async (user_id, event_id) => {
        const query = `INSERT INTO likedevents (user_id, event_id)
                       VALUES ($1 , $2);`;
        const result = await pool.query(query, [user_id, event_id]);
        return result.rows;
    },

    unlikeEvent: async (user_id, event_id) => {
        const query = `DELETE FROM likedevents WHERE user_id = $1 AND event_id = $2`;
        const result = await pool.query(query, [user_id, event_id]);
        return result.rows;
    },

    getLikedEventsByUser: async (user_id) => {
        const query = `SELECT e.*
                       FROM likedevents le
                       JOIN events e ON le.event_id = e.event_id
                       WHERE le.user_id = $1
                       `;
        const result = await pool.query(query, [user_id]);
        return result.rows;
    },

    insertGeneratedSeats: async (generatedSeats) => {
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
    },

    getAllBookingsOfAnOrganizer: async (organizer_id) => {
        const query = `
            SELECT 
                b.booking_id,
                b.created_at AS booking_time,
                b.payment_status,
                se.seat_number,
                se.seat_category,
                se.price,
                sh.show_id,
                sh.start_time,
                sh.end_time,
                sh.show_date,
                e.title AS event_title,
                u.name AS booked_by,
                u.email AS user_email
            FROM bookings b
            JOIN seats se ON b.seat_id = se.seat_id
            JOIN shows sh ON b.show_id = sh.show_id
            JOIN events e ON sh.event_id = e.event_id
            JOIN users u ON b.user_id = u.email
            WHERE e.organizer_id = $1
            ORDER BY sh.show_date, sh.start_time;
        `;
        const result = await pool.query(query, [organizer_id]);
        return result.rows;
    },


    getEventwiseEarningofOrganizer: async (organizer_id) => {
        const query = `
            SELECT 
                e.event_id,
                e.title AS event_title,
                SUM(p.amount) AS total_earnings
            FROM events e
            JOIN shows sh ON sh.event_id = e.event_id
            JOIN bookings b ON b.show_id = sh.show_id
            JOIN payment p ON b.transaction_id = p.transaction_id
            WHERE 
                e.organizer_id = $1
                AND p.status = 'paid'
            GROUP BY e.event_id, e.title;
        `;
        const result = await pool.query(query, [organizer_id]);
        return result.rows;
    },


    getAllBookingsOfAUser: async (user_id) => {
        const query = `
            SELECT 
                b.booking_id,
                b.user_id,
                b.payment_status,
                b.created_at AS booking_time,
                
                e.event_id,
                e.title AS event_title,
                e.category,
                e.start_date,
                e.end_date,
                
                s.show_id,
                s.show_date,
                s.start_time,
                s.end_time,
                
                se.seat_id,
                se.seat_number,
                se.seat_category,
                se.price,
            
                v.name AS venue_name,
                v.city,
                v.address,
            
                p.transaction_id,
                p.amount,
                p.status AS payment_status,
                p.created_at AS payment_time
            
            FROM bookings b
            JOIN shows s ON b.show_id = s.show_id
            JOIN events e ON s.event_id = e.event_id
            JOIN seats se ON b.seat_id = se.seat_id
            JOIN venues v ON s.venue_id = v.venue_id
            LEFT JOIN payment p ON b.transaction_id = p.transaction_id
            WHERE b.user_id = $1
            ORDER BY b.created_at DESC;
        `;
        const result = await pool.query(query, [user_id]);
        return result.rows;
    },

    getEventsByCityAndInterest : async(user_id , city) => {
        const query = `
        SELECT e.*
        FROM events e
        JOIN venues v ON e.venue_id = v.venue_id
        JOIN user_interests ui ON e.category = ui.category
        WHERE ui.user_id = $1 AND LOWER(v.city) = LOWER($2)
        ORDER BY e.start_date ASC;
      `;
      const result = await pool.query(query , [user_id , city]);
      return result.rows;
    },

    getOngoingEventsByCity : async(city) => {
        const query = `
        SELECT e.*
        FROM events e
        JOIN venues v ON e.venue_id = v.venue_id
        WHERE e.status = 'ongoing' AND LOWER(v.city) = LOWER($1)
        ORDER BY e.start_date ASC;
      `;
      const result = await pool.query(query , [city]);
      return result.rows;
    },

    getUpcomingEventsByCity : async(city) => {
        const query = `
        SELECT e.*
        FROM events e
        JOIN venues v ON e.venue_id = v.venue_id
        WHERE e.status = 'upcoming' AND LOWER(v.city) = LOWER($1)
        ORDER BY e.start_date ASC;
      `;
      const result = await pool.query(query , [city]);
      return result.rows;
    },


    createShowAndSeats: async ({ event_id, venue_id, start_time, end_time, show_date, plan_name }) => {
        try {
          await pool.query('BEGIN');
    
          // 1. Get the layout from seating_plans
          const layoutRes = await pool.query(
            'SELECT layout FROM seating_plans WHERE plan_name = $1',
            [plan_name]
          );
    
          if (layoutRes.rowCount === 0) {
            throw new Error('Seating layout not found');
          }
    
          const layout = layoutRes.rows[0].layout;
    
          // 2. Count total seats
          let totalSeats = 0;
          layout.sections.forEach(section => {
            totalSeats += section.rows.length * section.seats_per_row;
          });
    
          // 3. Create the show
          const showRes = await pool.query(
            `INSERT INTO shows (event_id, venue_id, start_time, end_time, total_seats, show_date)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING show_id`,
            [event_id, venue_id, start_time, end_time, totalSeats, show_date]
          );
    
          const show_id = showRes.rows[0].show_id;
    
          // 4. Insert seats
          let seatCounter = 1;
          for (const section of layout.sections) {
            for (const row of section.rows) {
              for (let i = 1; i <= section.seats_per_row; i++) {
                const seat_number = `${row}${i}`; // e.g., A1, A2, B5 etc.
                await pool.query(
                  `INSERT INTO seats (seat_number, show_id, seat_category, price)
                   VALUES ($1, $2, $3, $4)`,
                  [seat_number, show_id, section.category, section.price]
                );
                seatCounter++;
              }
            }
          }
    
          await pool.query('COMMIT');
          return { show_id, total_seats: totalSeats };
        } catch (error) {
          await pool.query('ROLLBACK');
          throw error;
        } 
      }
}


export default Event 