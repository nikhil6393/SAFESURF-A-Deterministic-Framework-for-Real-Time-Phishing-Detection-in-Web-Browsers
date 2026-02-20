/**
 * Enhanced Feature Extractor
 * Extracts advanced features from URL for high-accuracy detection
 */

module.exports = function extractFeatures(url) {
    let hostname = "";
    let pathname = "";
    let search = "";

    try {
        const parsed = new URL(url.startsWith('http') ? url : 'http://' + url);
        hostname = parsed.hostname.toLowerCase();
        pathname = parsed.pathname.toLowerCase();
        search = parsed.search.toLowerCase();
    } catch (e) {
        hostname = url.toLowerCase();
    }

    const fullPath = hostname + pathname + search;

    // 1. Suspicious TLDs
    const suspiciousTLDs = [
        '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work',
        '.click', '.link', '.loan', '.download', '.stream', '.online',
        '.site', '.best', '.magic', '.win', '.party', '.bid'
    ];
    const hasSuspiciousTLD = suspiciousTLDs.some(tld => hostname.endsWith(tld));

    // 2. Sensitive Keywords (Phishing Indicators)
    const sensitiveKeywords = [
        'login', 'verify', 'account', 'secure', 'update', 'bank', 'wallet',
        'signin', 'support', 'service', 'billing', 'confirm', 'validation',
        'auth', 'portal', 'ebayisapi', 'paypal', 'webscr', 'wp-admin'
    ];
    const foundKeywords = sensitiveKeywords.filter(kw => fullPath.includes(kw));

    // 3. Brand Impersonation (Look-alike domains)
    const brands = [
        'google', 'microsoft', 'apple', 'icloud', 'amazon', 'facebook',
        'instagram', 'twitter', 'linkedin', 'netflix', 'paypal', 'binance',
        'coinbase', 'blockchain', 'meta-mask', 'adobe', 'steam'
    ];
    // Check if brand is in subdomain or part of a hyphenated domain, but NOT the main official domain
    const brandImpersonation = brands.some(brand => {
        const isOfficial = hostname === brand + '.com' || hostname.endsWith('.' + brand + '.com') ||
            hostname === brand + '.net' || hostname.endsWith('.' + brand + '.net') ||
            hostname === brand + '.org' || hostname.endsWith('.' + brand + '.org');
        return hostname.includes(brand) && !isOfficial;
    });

    // 4. Structural Metrics
    const digitCount = (hostname.match(/\d/g) || []).length;
    const dashCount = (hostname.match(/-/g) || []).length;
    const dotCount = (hostname.match(/\./g) || []).length;

    // Obfuscation indicators
    const hasIP = /\d+\.\d+\.\d+\.\d+$/.test(hostname);
    const hasUrlShortener = /bit\.ly|goo\.gl|t\.co|tinyurl\.com|is\.gd|buff\.ly|bit\.do|ow\.ly/.test(hostname);
    const hasEncodedChars = /%[0-9A-Fa-f]{2}/.test(url);
    const hasDoubleExtension = /\.(exe|zip|rar|gz|bat|scr|msi|ps1|vbs|sh)\.(exe|zip|rar|gz|bat|scr|msi|ps1|vbs|sh)$/i.test(url);

    return {
        url,
        hostname,
        length: url.length,
        hasHttps: url.startsWith("https"),
        hasSpecialChars: /[@%]/.test(url),
        hasIP,
        dashCount,
        dotCount,
        digitCount,
        hasUrlShortener,
        hasSuspiciousTLD,
        foundKeywords,
        brandImpersonation,
        hasEncodedChars,
        hasDoubleExtension
    };
};
