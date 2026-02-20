const fs = require('fs');
const path = require('path');
const ScanResult = require('./ScanResult');

class HistoryService {
    constructor() {
        this.localPath = path.join(__dirname, '../data/history.json');
        this.isCloudConnected = false;

        // Ensure data dir exists
        const dataDir = path.dirname(this.localPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Ensure local file exists
        if (!fs.existsSync(this.localPath)) {
            fs.writeFileSync(this.localPath, JSON.stringify([]));
        }
    }

    setCloudStatus(status) {
        this.isCloudConnected = status;
        console.log(`History Service: Cloud Support ${status ? 'ACTIVE' : 'OFFLINE (Falling back to local)'}`);
    }

    async save(result) {
        const record = {
            ...result,
            timestamp: new Date(),
            refId: 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };

        // 1. Always save locally as a definitive backup
        try {
            const localData = JSON.parse(fs.readFileSync(this.localPath, 'utf8'));
            localData.unshift(record);
            // Cap at 100 items locally
            fs.writeFileSync(this.localPath, JSON.stringify(localData.slice(0, 100), null, 2));
        } catch (e) {
            console.error("Local History Save Failed:", e.message);
        }

        // 2. Try Cloud save if connected
        if (this.isCloudConnected) {
            try {
                const cloudRecord = new ScanResult(record);
                await cloudRecord.save();
            } catch (e) {
                console.warn("Cloud Save Failed (but local saved):", e.message);
            }
        }

        return record;
    }

    async getRecent() {
        if (this.isCloudConnected) {
            try {
                return await ScanResult.find().sort({ timestamp: -1 }).limit(20);
            } catch (e) {
                console.warn("Cloud Fetch Failed, using local cache");
            }
        }

        try {
            return JSON.parse(fs.readFileSync(this.localPath, 'utf8')).slice(0, 20);
        } catch (e) {
            return [];
        }
    }
}

module.exports = new HistoryService();
