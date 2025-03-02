const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/model'); 


// Register
const register = async (req, res) => {
    try {
        const { email, password, name, domain } = req.body;

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
            role: 'evaluator', // Default role
            domain,
            approval_status: 'pending'
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.approval_status === 'pending') {
            return res.status(403).json({ message: 'Your account is pending approval. Please wait for admin approval.' });
        } else if (user.approval_status === 'rejected') {
            return res.status(403).json({ message: 'Your account has been rejected. Contact support for further assistance.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { uid: user.uid, email: user.email, role: user.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { register, login };