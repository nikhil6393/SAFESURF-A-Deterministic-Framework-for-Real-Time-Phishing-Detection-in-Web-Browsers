# SafeSurf Technical Explanation (Teacher Q&A)

This document contains the logic and technical explanations for the SafeSurf extension's URL scanning and phishing detection systems.

## 1. Real-Time URL Scanner
**Teacher Question:** “How exactly are you checking the URL?”

**Logic:**
1. **Normalize URL:** Extract the domain using `new URL().hostname` and convert to lowercase.
2. **Check Local Cache:** First, see if the domain has been scanned recently.
3. **Blacklist Check:** If not in cache, check against a list of known malicious domains.
4. **Cache result:** Store the outcome to speed up future checks on the same domain.

**Technical Response:** “We use a multi-stage verification process starting with URL normalization and local caching, followed by a prioritized blacklist lookup to identify known threats instantly.”

---

## 2. Heuristic Phishing Detection
**Teacher Question:** “How do you detect zero-day phishing?”

**Logic:**
We assign risk points based on suspicious patterns:
- **IP-based URLs:** +30 points (Common in phishing as they bypass DNS filters).
- **Suspicious TLDs:** +20 points (e.g., `.tk`, `.ml` are often free/low-cost and abused).
- **Subdomain Count:** +15 points (Too many subdomains like `login.secure.bank.verify.com` indicate obfuscation).
- **Suspicious Keywords:** +10 points (Presence of `login`, `verify`, `bank` in the URL).

**Technical Response:** “We use structural and lexical analysis of domains to identify phishing characteristics, allowing us to detect suspicious patterns in real-time even if the domain isn't on a blacklist yet.”

---

## 3. Risk Score + Explainability
**Teacher Question:** “How do you calculate risk?”

**Logic:**
We combine multiple weights:
- **Blacklist Weight:** 70 points if found in the local blacklist.
- **Heuristic Weight:** Variable points based on the patterns detected above.
- **Decision Logic:** If the total score exceeds **60**, we classify the site as high-risk and trigger a warning.

**Technical Response:** “We use threshold-based decision making to reduce false positives by combining deterministic (blacklist) and probabilistic (heuristic) scores into a unified risk metric.”

---

## 4. Redirect Chain Tracking
**Teacher Question:** “How do you handle redirects?”

**Logic:**
We use the `chrome.webRequest.onBeforeRedirect` API to intercept redirect events. For every redirect, we re-evaluate the target URL through our risk scanner before the browser even loads the final destination.

**Technical Response:** “We analyze the final destination of redirect chains to prevent obfuscated phishing attempts and ensure that malicious actors cannot hide behind multiple hops.”
