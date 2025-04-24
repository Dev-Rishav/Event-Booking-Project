import pool from '../database/db.js';

const Subscription = {
  createSubscriptionPlan: async (planData) => {
    const {
      plan_name,
      description,
      max_events,
      price,
      duration_days
    } = planData;

    const query = `
          INSERT INTO subscription_plans 
          (plan_name, description, max_events, price, duration_days)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;

    const values = [plan_name, description, max_events, price, duration_days];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getAllSubscriptionPlans: async () => {
    const query = `SELECT * FROM subscription_plans`;
    const result = await pool.query(query);
    return result.rows;
  },

  getSubscriptionPlanByID: async (plan_id) => {
    const query = `SELECT * FROM subscription_plans WHERE plan_id = $1`;
    const result = await pool.query(query, [plan_id]);
    return result.rows[0];
  },

  getCurrentSubscriptionOfOrganizer : async(organizer_email) => {
    const query = `SELECT * FROM organizer_subscriptions WHERE organizer_email = $1`;
    const result = await pool.query(query, [organizer_email]);
    return result.rows[0];
  },

  setStatusInactiveOfPlan: async(plan_id) => {
  const query = `UPDATE subscription_plans SET is_active = false  WHERE  plan_id = $1 ;`;
  const result = await pool.query(query , [plan_id]);
  },

  setStatusActiveOfPlan: async(plan_id) => {
    const query = `UPDATE subscription_plans SET is_active = true  WHERE  plan_id = $1 ;`;
    const result = await pool.query(query , [plan_id]);
    },

}

export default Subscription;