import pool from "../database/db.js";

const User = {
    create: async(email,name,phone,password,role) => {
      const query = "INSERT INTO users (email,name,phone,password,role) VALUES ($1, $2, $3,$4,$5)";
      const result = await pool.query(query, [email,name,phone,password,role]);
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