// Using built-in fetch in Node v24

async function verify() {
    console.log("🧪 Starting Dataset Integration Verification...\n");

    const tests = [
        { url: 'br-icloud.com.br', expectedLabel: 'Malicious' },
        { url: 'mp3raid.com/music/krizz_kaliko.html', expectedLabel: 'Safe' },
        { url: 'http://wap. xxxmobilemovieclub.com?n=QJKGIGHJJGCBL', expectedLabel: 'Malicious' }
    ];

    for (const test of tests) {
        try {
            const res = await fetch('http://localhost:5000/api/check-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: test.url })
            });
            const data = await res.json();

            const success = data.label === test.expectedLabel;
            console.log(`${success ? '✅' : '❌'} URL: ${test.url}`);
            console.log(`   Expected: ${test.expectedLabel}, Got: ${data.label} (Score: ${data.score})`);
            if (data.source) console.log(`   Source: ${data.source}`);
        } catch (e) {
            console.log(`❌ Failed to connect to server for ${test.url}`);
        }
    }
}

verify();
