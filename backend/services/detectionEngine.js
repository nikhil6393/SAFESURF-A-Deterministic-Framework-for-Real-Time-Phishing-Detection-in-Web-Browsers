/**
 * Advanced Detection Engine with Dynamic Weighted Scoring
 * Implements heuristics-based analysis with high-accuracy indicators
 */

const trustedDomains = [
    "google.com", "github.com", "microsoft.com", "openai.com",
    "amazon.com", "facebook.com", "youtube.com", "twitter.com",
    "linkedin.com", "stackoverflow.com", "wikipedia.org", "reddit.com",
    "apple.com", "netflix.com", "dropbox.com", "adobe.com", "paypal.com",
    "microsoftonline.com", "live.com", "bing.com", "yahoo.com"
];

module.exports = function detect(f) {
    let score = 0;
    const details = [];

    // Helper to add detail
    const addDetail = (label, impact, type) => {
        score += impact;
        details.push({ label, impact, type });
    };

    // 🔴 HIGH-RISK FACTORS (Critical)

    // Brand Impersonation (Extremely High Risk)
    if (f.brandImpersonation) {
        addDetail("Suspected Brand Impersonation/Look-alike domain", 65, "risk");
    }

    // IP-based URL
    if (f.hasIP) {
        addDetail("Raw IP address used instead of domain", 60, "risk");
    }

    // Double extensions
    if (f.hasDoubleExtension) {
        addDetail("Dangerous double file extension detected", 50, "risk");
    }

    // 🟠 MEDIUM-RISK FACTORS (Heuristic)

    // Sensitive Keywords
    if (f.foundKeywords && f.foundKeywords.length > 0) {
        const impact = Math.min(f.foundKeywords.length * 20, 45);
        addDetail(`URL contains suspicious keywords: ${f.foundKeywords.join(", ")}`, impact, "risk");
    }

    // Obfuscation symbols
    if (f.hasSpecialChars) {
        addDetail("URL contains obfuscation symbols (@, %)", 30, "risk");
    }

    // URL shortener
    if (f.hasUrlShortener) {
        addDetail("Potential obfuscation via URL shortener", 25, "risk");
    }

    // Suspicious TLD
    if (f.hasSuspiciousTLD) {
        addDetail("Non-standard/Low-reputation domain suffix (TLD)", 30, "risk");
    }

    // 🟡 LOW-RISK FACTORS (Structural)

    // Excessive dashes
    if (f.dashCount > 3) {
        addDetail(`Abnormal dash count in domain (${f.dashCount})`, 15, "risk");
    }

    // Excessive digits
    if (f.digitCount > 4) {
        addDetail(`High digit density in domain (${f.digitCount})`, 15, "risk");
    }

    // URL length
    if (f.length > 100) {
        addDetail("Excessively long URL structure", 10, "risk");
    }

    // Subdomains
    if (f.dotCount > 4) {
        addDetail("Highly nested subdomain structure", 10, "risk");
    }

    // 🟢 SAFETY FACTORS (Mitigations)

    // HTTPS enabled
    if (f.hasHttps) {
        addDetail("Verified Encryption (HTTPS)", -15, "safety");
    } else {
        addDetail("Unsecured connection (No HTTPS)", 25, "risk");
    }

    // Trusted Domain Check
    const hostname = f.hostname || "";
    const isTrusted = trustedDomains.some(domain =>
        hostname === domain || hostname.endsWith("." + domain)
    );

    if (isTrusted) {
        addDetail("Verified Official Domain Whitelist", -80, "safety");
    }

    // Normalize final score
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    // Accuracy-tuned Thresholds
    let label = "Safe";
    if (score >= 60) {
        label = "Malicious";
    } else if (score >= 35) {
        label = "Suspicious";
    }

    return { score, label, details };
};
