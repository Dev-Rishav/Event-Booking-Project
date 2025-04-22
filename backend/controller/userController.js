import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

export const register = async (req, res) => {
    try {
      const { email, name, phone, password, role, interests } = req.body;
  
      if (interests && !Array.isArray(interests)) {
        return res.status(400).json({ error: "Interests must be an array" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
     
      const is_organizer = role === 'organizer';
  
      
      const free_events_remaining = is_organizer ? 5 : null;
      const current_subscription_id = null;
  
     
      const result = await User.create(
        email,
        name,
        phone,
        hashedPassword,
        role,
        interests,
        is_organizer,
        free_events_remaining,
        current_subscription_id
      );
  
      res.status(201).json({ message: 'User registered successfully', user: result });
  
    } catch (error) {
      console.error("Error in register function:", error);
  
      if (error.code === '23505' && error.constraint === 'user_interests_user_id_category_key') {
        return res.status(400).json({ error: "Duplicate interest category for user" });
      }
  
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user by email
        const user = await User.findByEmail(email);

        // console.log("DB Query Result:", user); // Debugging log

        // Check if user exists
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (!password || !user.password) {
            console.error("Error: One or both passwords are missing!", { password, dbPassword: user.password });
            return res.status(500).json({ error: "Internal server error" });
        }
        

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user.email  , role: user.role }, process.env.JWT_SECRET, { expiresIn: "6h" });

        res.json({ token , role: user.role  ,  userId: user.email });

    } catch (error) {
        console.error("Error in login function:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
