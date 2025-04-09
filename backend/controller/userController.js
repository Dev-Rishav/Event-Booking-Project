import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

export const register = async (req, res) => {
    try {
        const { email, name, phone, password, role } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Debugging logs
        // console.log("Received Data:", req.body);

        // Create User in DB (assuming User.create is a DB function)
        const result = await User.create(email, name, phone, hashedPassword, role);

        // If user is successfully created
        res.status(201).json({ message: 'User registered successfully', user: result });

    } catch (error) {
        console.error("Error in register function:", error);
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
        const token = jwt.sign({ userId: user.email  , role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token , role: user.role  ,  userId: user.email });

    } catch (error) {
        console.error("Error in login function:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
