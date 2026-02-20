const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    console.log("🔍 Attempting to connect to MongoDB...");
    console.log("URI:", process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@')); // Hide password in logs

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("✅ SUCCESS: Connected to MongoDB!");
        process.exit(0);
    } catch (err) {
        console.error("❌ FAILED: Connection Error Details:");
        console.error("Name:", err.name);
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        process.exit(1);
    }
}

testConnection();
