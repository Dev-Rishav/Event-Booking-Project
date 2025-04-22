import Subscription from "../model/SubscriptionModel.js";
import pool from "../database/db.js";
import paypal from "../helper/paypal.js";

export const createSubscriptionPlan = async (req, res) => {
  console.log(req.body);
  
    try {
      const { plan_name, description, max_events, price, duration_days } = req.body;
  
      if (!plan_name || !max_events || !price || !duration_days) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }
  
      const result = await Subscription.createSubscriptionPlan({
        plan_name,
        description,
        max_events,
        price,
        duration_days
      });
  
      return res.status(201).json({ message: 'Plan created successfully.', result });
  
    } catch (err) {
      console.error('Error creating plan:', err.message);
      return res.status(500).json({ message: 'Server error. Could not create plan.' });
    }
  }


  export const createOrganizerSubscription = async (req, res) => {
    console.log("atul  + vikas + dick");

    try {
     
      const { email, price, plan_id , start_date ,end_date } = req.body;
  
      // Step 1: Create PayPal payment
      const create_payment_json = {
        intent: "sale",
        payer: { payment_method: "paypal" },
        redirect_urls: {
          return_url: "http://localhost:5173/organizer/paypal-subscription-return",
          cancel_url: "http://localhost:5173/organizer/paypal-subscription-cancel",
        },
        transactions: [
          {
            item_list: {
              items: [{
                name: `${plan_id} Subscription`,
                sku: "sub-001",
                price: price.toFixed(2),
                currency: "USD",
                quantity: 1,
              }],
            },
            amount: {
              currency: "USD",
              total: price.toFixed(2),
            },
            description: "Organizer subscription plan",
          },
        ],
      };
  
      paypal.payment.create(create_payment_json, async (error, payment) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: "PayPal error" });
        }
  
        const approvalURL = payment.links.find(link => link.rel === "approval_url").href;
        const transaction_id = payment.id;
        // end_date = start_date;
  
        // Insert into organizer_subscription table with status 'pending'
        await pool.query(
          `INSERT INTO organizer_subscriptions (organizer_email, plan_id , start_date , end_date ,transaction_id)
           VALUES ($1, $2, $3, $4, $5 )`,
          [email , plan_id , start_date , end_date ,transaction_id]
        );
  
        res.status(201).json({
          success: true,
          approvalURL,
          transaction_id,
        });
      });
  
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, message: "Subscription creation failed" });
    }
  };


  export const captureOrganizerSubscription = async (req, res) => {
    const { paymentId, PayerID, email } = req.body;
  
    try {
      paypal.payment.execute(paymentId, { payer_id: PayerID }, async (error, payment) => {
        if (error) {
          console.error('PayPal Error:', error.response);
          return res.status(500).json({ message: 'Payment capture failed' });
        }
  
        try {
          await pool.query('BEGIN');
  
          // Update payment status to 'paid'
          await pool.query(
            `UPDATE organizer_subscriptions
             SET payment_status = 'paid'
             WHERE transaction_id = $1`,
            [paymentId]
          );
  
        
  
          await pool.query('COMMIT');
  
          res.status(200).json({
            message: 'Subscription payment captured and  status updated.',
            transaction_id: paymentId
          });
  
        } catch (dbError) {
          await pool.query('ROLLBACK');
          console.error('DB Error:', dbError);
          res.status(500).json({ message: 'Database update failed after payment capture' });
        }
      });
  
    } catch (err) {
      console.error('Unexpected Error:', err);
      res.status(500).json({ message: 'Unexpected error during payment capture' });
    }
  };


  export const getAllSubscriptionPlans = async(req,res) => {
    try {
      const result = await Subscription.getAllSubscriptionPlans();
      return res.status(200).json({ msg : "All plans : " , result });
    } catch (error) {
      console.error("Error fetching subscription plans:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to fetch subscription plans",
      });
    }
  }


  export const getSubscriptionPlanByID = async(req,res) => {
    const plan_id = req.params.id;
    try {
      const result = await Subscription.getSubscriptionPlanByID(plan_id);
      return res.status(200).json({ msg : "plan : " , result });
    } catch (error) {
      console.error("Error fetching subscription plan:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to fetch subscription plan",
      });
    }
  }
  