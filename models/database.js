// database.js
const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async (retries = 5) => {
    const dbURI = process.env.MONGO_DB_ATLAS_DB_URI;
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(dbURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB connected');
            return; // Exit the function after a successful connection
        } catch (err) {
            console.error(`Failed to connect to MongoDB (attempt ${i + 1}/${retries}):`, err.message);
            if (i < retries - 1) {
                // Wait a few seconds before retrying
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
    console.error('Could not connect to MongoDB after multiple attempts');
};

module.exports = connectDB;
