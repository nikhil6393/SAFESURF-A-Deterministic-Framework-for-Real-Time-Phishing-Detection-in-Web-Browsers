async function test() {
    const url = 'http://apple-secure-verify-login-update.top';
    console.log(`Testing URL: ${url}`);
    const res = await fetch('http://localhost:5000/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
test();
