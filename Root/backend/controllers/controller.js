const bcrypt = require('bcrypt');
const { User } = require('../models/model.js');

// Register User
const register = async (req, res) => {
    try {
        const { email, password, name, domain } = req.body; // Removed `role`

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            role: 'evaluator', 
            domain,
            approval_status: 'pending' 
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { register };