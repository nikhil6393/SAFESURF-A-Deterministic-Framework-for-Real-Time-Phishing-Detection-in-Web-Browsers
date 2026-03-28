const loader = require('./services/DatasetLoader');
const fs = require('fs');

console.log("Starting compilation...");
loader.init();
const map = loader.urlMap;

const outPath = './data/dataset.csv';
let csvContent = 'url,label,type\n';

let i = 0;
for (let [url, details] of map) {
    if (i >= 1000) break;
    csvContent += `${url},${details.label},${details.type}\n`;
    i++;
}

fs.writeFileSync(outPath, csvContent);
console.log(`Successfully compiled ${i} signatures to ${outPath}`);
