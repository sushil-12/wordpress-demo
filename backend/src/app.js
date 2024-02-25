const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedUserRoutes');
const commonRoutes = require('./routes/commanRoutes');
const { CustomError, ErrorHandler, ResponseHandler } = require('./utils/responseHandler');
const connectDB = require('./config/database');
const app = express();
const fs = require('fs');

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
app.post('/writefile', (req, res) => {
    const jsonData = req.body;
    const jsonString = JSON.stringify(jsonData, null, 2);
    // Write JSON data to file
    fs.writeFile('./src/constants/sidebar.json', jsonString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error writing file');
        } else {
            ResponseHandler.success(res, {message: 'Sidebar Updated Succesfuly'}, HTTP_STATUS_CODES.CREATED);
        }
    });
});

// 404 Error Handler
app.use((req, res, next) => {
    ErrorHandler.handleNotFound(res);
});

// Generic Error Handler
app.use((err, req, res, next) => {
    ErrorHandler.handleError(err, res);
});

module.exports = app;