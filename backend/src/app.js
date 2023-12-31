const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedUserRoutes');
const commonRoutes = require('./routes/commanRoutes');
const { CustomError, ErrorHandler } = require('./utils/responseHandler');
const connectDB = require('./config/database');
const app = express();
const cors = require('cors');

// Connect to MongoDB
connectDB();
// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/api/common', commonRoutes);

// protected route
app.use('/api', protectedRoutes);


app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
})

// 404 Error Handler
app.use((req, res, next) => {
    ErrorHandler.handleNotFound(res);
});

// Generic Error Handler
app.use((err, req, res, next) => {
    ErrorHandler.handleError(err, res);
});

module.exports = app;