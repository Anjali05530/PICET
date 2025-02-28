const bcrypt = require('bcrypt');
const { User } = require('../models/model.js');

// Register User
const register = async (req, res) => {
    try {
        const { email, password, name, domain } = req.body; // Removed `role`

        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with default role 'evaluator'
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            role: 'evaluator', // Default role
            domain, // Domain remains optional
            approval_status: 'pending' // Default approval status
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { register };