const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

//const connectDB = require('./config/db');

// Routes
const authRoutes = require('./modules/auth/routes');
const cardRoutes = require('./modules/card/routes');
const uploadRoutes = require('./modules/card/uploadRoutes');

const app = express();

// Connect DB
//connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/upload', uploadRoutes); // 👈 Added upload route

app.get('/', (req, res) => res.send('Digital Visiting Card API Running'));

// Ping route to keep server awake (UptimeRobot)
app.get('/api/ping', (req, res) => {
  res.status(200).json({ status: 'alive', message: 'Server is awake' });
});

module.exports = app;