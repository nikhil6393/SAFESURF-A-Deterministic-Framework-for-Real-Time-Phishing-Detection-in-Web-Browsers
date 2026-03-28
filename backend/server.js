const express = require('express');
const cors = require('cors');
const extractFeatures = require('./services/featureExtractor');
const detect = require('./services/detectionEngine');
const datasetLoader = require('./services/DatasetLoader');
const connectDB = require('./services/db');
const historyService = require('./services/HistoryService');
require('dotenv').config();

// Initialize Cloud Database
connectDB();

// Initialize Dataset
datasetLoader.init();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// IMPROVED HEURISTIC ENGINE: Weighted Scoring with Whitelist
const analyzeURL = (url) => {
    // 1. Check known dataset first (Direct Recognition)
    const knownMatch = datasetLoader.check(url);
    if (knownMatch) {
        return {
            url,
            score: knownMatch.label === 'malicious' ? 95 : (knownMatch.label === 'suspicious' ? 45 : 0),
            label: knownMatch.label.charAt(0).toUpperCase() + knownMatch.label.slice(1),
            details: [{ label: `Known ${knownMatch.type} pattern from local intelligence`, impact: knownMatch.label === 'malicious' ? 95 : 45, type: knownMatch.label === 'safe' ? 'safety' : 'risk' }],
            source: 'dataset'
        };
    }

    // 2. Extract features from URL
    const features = extractFeatures(url);

    // 3. Run detection engine with weighted scoring
    const result = detect(features);

    return {
        url,
        score: result.score,
        label: result.label,
        details: result.details,
        source: 'heuristics'
    };
};

// API Endpoints
app.post('/api/check-url', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const result = analyzeURL(url);
    console.log(`[SCAN] ${url} -> ${result.label} (${result.score}) [Source: ${result.source}]`);

    // Persist to History (Cloud with Local Fallback)
    historyService.save({
        url: result.url,
        label: result.label,
        score: result.score,
        source: result.source
    });

    res.json(result);
});

app.get('/api/history', async (req, res) => {
    const history = await historyService.getRecent();
    res.json(history);
});

app.get('/api/dataset', (req, res) => {
    res.json(datasetLoader.getAll());
});

app.get('/api/dataset-stats', (req, res) => {
    res.json(datasetLoader.getStats());
});

app.get('/api/stats', async (req, res) => {
    const history = await historyService.getRecent();
    const datasetStats = datasetLoader.getStats();

    // Calculate dashboard stats
    const totalScanned = history.length;
    const threatsBlocked = history.filter(h => h.label !== 'Safe').length;

    res.json({
        totalScanned,
        threatsBlocked,
        intelligenceSize: datasetStats.totalItems
    });
});

app.listen(PORT, () => {
    console.log(`Security Backend running at http://localhost:${PORT}`);
});
