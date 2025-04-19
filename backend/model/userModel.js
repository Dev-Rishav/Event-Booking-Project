import pool from "../database/db.js";

const User = {
    create: async(email,name,phone,password,role, interests = []) => {
      const query = "INSERT INTO users (email,name,phone,password,role) VALUES ($1, $2, $3,$4,$5)";
      const result = await pool.query(query, [email,name,phone,password,role]);

      if (interests && interests.length > 0) {
        for (const category of interests) {
          const interestQuery = "INSERT INTO user_interests (user_id, category) VALUES ($1, $2)";
          await pool.query(interestQuery, [email, category]);
        }
      }

      return result.rows[0];
    },
    
    findByEmail: async(email) => {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await pool.query(query, [email]);
      return result.rows[0];
    },

    findById: async(userId) => {
      // console.log(userId);
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await pool.query(query , [userId]);
      return result.rows[0];
    },

    updatePhoneNumber: async(userId , phoneNumber) => {
      const query = "UPDATE users SET phone = $1 WHERE email = $2";
      const result = await pool.query(query , [phoneNumber , userId]);
    }
}

export default User;