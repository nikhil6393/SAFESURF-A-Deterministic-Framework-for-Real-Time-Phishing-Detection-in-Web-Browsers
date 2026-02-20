/**
 * Test script to verify improved scoring technique
 * Compares detection results for various URLs
 */

const extractFeatures = require('./services/featureExtractor');
const detect = require('./services/detectionEngine');

const testURLs = [
    { url: "https://google.com", expectedLabel: "Safe" },
    { url: "https://github.com", expectedLabel: "Safe" },
    { url: "https://microsoft.com/products", expectedLabel: "Safe" },
    { url: "http://192.168.1.5/login", expectedLabel: "Malicious" },
    { url: "http://free-gift-card.xyz", expectedLabel: "Suspicious/Malicious" },
    { url: "https://secure-bank-login.net", expectedLabel: "Suspicious" },
    { url: "http://bit.ly/xyz", expectedLabel: "Suspicious" },
    { url: "http://secure-login.com/@verify", expectedLabel: "Malicious" }
];

console.log("\n🧪 TESTING IMPROVED DETECTION ENGINE\n");
console.log("=" .repeat(80));

testURLs.forEach((test, index) => {
    const features = extractFeatures(test.url);
    const result = detect(features);
    
    const statusIcon = result.label === "Safe" ? "✅" : 
                       result.label === "Suspicious" ? "⚠️" : "🚨";
    
    console.log(`\n${index + 1}. ${statusIcon} ${test.url}`);
    console.log(`   Expected: ${test.expectedLabel}`);
    console.log(`   Result: ${result.label} (Score: ${result.score})`);
    console.log(`   Details:`);
    result.details.forEach(detail => {
        console.log(`     - ${detail}`);
    });
});

console.log("\n" + "=".repeat(80));
console.log("\n✅ Test Complete!\n");
