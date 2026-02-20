const mongoose = require('mongoose');

const scanResultSchema = new mongoose.Schema({
    url: { type: String, required: true },
    label: { type: String, required: true },
    score: { type: Number, required: true },
    source: { type: String, required: true },
    type: { type: String },
    timestamp: { type: Date, default: Date.now },
    refId: { type: String }
});

module.exports = mongoose.model('ScanResult', scanResultSchema);
