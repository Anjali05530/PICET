require('dotenv').config();
const express = require('express');
const bodyParser = require('express');
const router = require('./routes/routes');
const { sequelize } = require('./models/model');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use('/api', router); 

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

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
