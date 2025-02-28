require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const router = require('./routes/routes');
const { sequelize } = require('./models/model');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Support URL-encoded data
app.use('/api', router);

// Database Connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
        await sequelize.sync({ alter: true });
        console.log('✅ Models synchronized.');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    }
})();

// Default route
app.get('/', (req, res) => {
    res.send('Hello, API is running 🚀');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
