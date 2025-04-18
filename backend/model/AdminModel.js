import pool from '../database/db.js'

const Admin = {
    getAllUsers : async() => {
        const query = `SELECT * FROM users WHERE role = 'user'`;
        const result = await pool.query(query);
        return result.rows;
    },

    getAllOrganizers : async() => {
        const query = `SELECT * FROM users WHERE role = 'organizer'`;
        const result = await pool.query(query);
        return result.rows; 
    },

    getUserbyEmail : async(email) => {
        const query = `SELECT * FROM users WHERE email = $1 `;
        const result = await pool.query(query , [email]);
        return result.rows[0];
    }
    
}

export default Admin;