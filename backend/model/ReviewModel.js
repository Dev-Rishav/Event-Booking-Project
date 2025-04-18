import pool from "../database/db.js";

const Review = {
  createReview : async(user_id, event_id, review_text) => {
        const query = `
        INSERT INTO reviews (user_id, event_id, review_text)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [user_id, event_id, review_text];
      const result = await pool.query(query, values);
      return result.rows[0]; 
    },

    getReviewsByEventId : async (event_id) => {
        const query = `
          SELECT r.*, u.name AS user_name
          FROM reviews r
          JOIN users u ON r.user_id = u.email
          WHERE r.event_id = $1
          ORDER BY r.review_date DESC;
        `;
        const result = await pool.query(query, [event_id]);
        return result.rows;
      },
}


export default Review;