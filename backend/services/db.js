const mongoose = require('mongoose');
const historyService = require('./HistoryService');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        historyService.setCloudStatus(true);
    } catch (err) {
        console.error(`❌ MongoDB Connection Error: ${err.message}`);
        historyService.setCloudStatus(false);
    }
};

module.exports = connectDB;
