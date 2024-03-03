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
const { HTTP_STATUS_CODES } = require('./constants/error_message_codes');

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
app.post('/upload/svg', (req, res) => {
    const { name, code } = req.body;
    const currentJson = './src/constants/svg_codes.json'; 
    if (!name || !code) {
        return res.status(400).json({ error: 'SVG name and code are required' });
    }

    // Read the existing JSON file
    fs.readFile(currentJson, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let svgData = {};
        try {
            // Parse the existing JSON content
            svgData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).send('Error parsing JSON');
        }

        // Append the new SVG data
        svgData[name] = code;

        const jsonString = JSON.stringify(svgData, null, 2);

        // Write back to the JSON file
        fs.writeFile(currentJson, jsonString, (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).send('Error writing file');
            }
            ResponseHandler.success(res, {message: 'SVG Added Succesfuly'}, HTTP_STATUS_CODES.CREATED);
        });
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