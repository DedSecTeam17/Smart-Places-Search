const express = require('express');
const routes = require('./routes/routes');
require('dotenv').config();
const connectDB = require('./models/database');
const path = require('path');

const cors = require('cors');

const app = express();
app.use(express.json({limit: '50MB'}));
app.use(express.urlencoded({limit: '50MB', extended: true}));

const PORT = process.env.PORT || 1339;

app.use(express.json()); // Middleware to parse JSON bodies

// Enable CORS for all origins
app.use(cors());

app.use('/api', routes);

connectDB();

const server = app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}}`)
});

// Set a long timeout (e.g., 24 hours)
server.setTimeout(24 * 60 * 60 * 1000);