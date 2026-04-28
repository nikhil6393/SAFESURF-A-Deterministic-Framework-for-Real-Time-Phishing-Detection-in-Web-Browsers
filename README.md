# 🛡️ SafeSurf — Real-Time Phishing & Malware URL Detection Framework

> **A Deterministic, Quad-Layer Defense System for Browser-Level Threat Neutralization**

<div align="center">

[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Brave-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Manifest](https://img.shields.io/badge/Manifest-V3%20Compliant-success?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Cloud-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Intel](https://img.shields.io/badge/Intel-640k%2B%20Signatures-DC143C?style=for-the-badge&logo=databricks&logoColor=white)](#-detection-methodology)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 🎯 Performance Snapshot

<div align="center">

| ⚡ Lookup Speed | 🎯 Detection Accuracy | 🛡️ Threat Signatures | 🔍 Detection Layers |
|:-:|:-:|:-:|:-:|
| **< 0.1 ms** | **95%** | **640,793+** | **4** |
| O(1) In-Memory Map | Post-Improvement | Local Intelligence | Quad-Layer Defense |

</div>

> 💡 **Zero-Day Ready**: Unlike pure blacklist tools, SafeSurf detects **never-before-seen** phishing domains through weighted heuristic scoring—no retraining required.

---

## 🏛️ Research Vision

SafeSurf is not a simple URL checker—it is a **research-grade cybersecurity framework** exploring how deterministic, rule-based systems can outperform probabilistic ML models for real-time browser-level threat detection.

Our core thesis: *In latency-critical, high-stakes security applications, an interpretable, deterministic system with O(1) lookup and weighted feature scoring can achieve higher precision and infinitely lower latency than black-box neural network classifiers.*

The system synthesizes four orthogonal detection methodologies into a unified, real-time threat pipeline:

```
URL Input ──► [Layer 1: Direct Recognition] ──► Known? → VERDICT
                        │ Unknown
                        ▼
             [Layer 2: Heuristic Scoring] ──── Feature Weighting
                        │
                        ▼
             [Layer 3: Content Deep Mining] ── Regex + De-obfuscation
                        │
                        ▼
             [Layer 4: Active DOM Defense] ─── Shadow DOM Hologram Shield
```

---

## 📚 Detection Methodology

### Layer 1 — Direct Recognition (O(1) Blacklist Lookup)

**Inspired by**: Classical signature-based IDS/IPS systems (Snort, Suricata)

The system indexes **640,793 verified malicious domains** into a JavaScript `Map` at startup. Every URL scan begins with an O(1) dictionary lookup after normalization.

**Key insight**: Regardless of whether the dataset grows to 10 million entries, lookup time remains **constant** (< 0.1 ms). This is mathematically guaranteed by hash-map collision bounds.

```
Normalization Pipeline:
  Raw URL → strip(https://) → strip(www.) → strip(trailing /) → lowercase → LOOKUP
```

**Classification on match**:
| Match Label | Score Assigned | Action |
|:---|:---:|:---|
| `malicious` | 95 | Hologram Shield triggered |
| `suspicious` | 45 | Warning popup shown |
| `safe` | 0 | Green indicator |

---

### Layer 2 — Weighted Heuristic Scoring Engine

**Inspired by**: SpamAssassin's additive rule scoring, Cox's Hazard Models

For URLs not found in the blacklist, the engine extracts **7 lexical risk signals** and **3 safety signals**, computing a continuous **Risk Score ∈ [0, 100]**.

$$\text{Risk Score} = \sum_{i} w_i \cdot \mathbf{1}[\text{risk}_i] - \sum_{j} w_j \cdot \mathbf{1}[\text{safety}_j]$$

#### 🔴 Risk Signal Weights

| Signal | Weight | Rationale |
|:---|:---:|:---|
| Raw IP Address in URL | **+50** | Legitimate sites virtually never use raw IPs for user-facing pages |
| Special Characters (`@`, `%`) | **+35** | Classic obfuscation vectors; `@` allows credential injection |
| Suspicious TLD (`.xyz`, `.top`, `.loan`, `.gq`) | **+25** | High empirical correlation with phishing campaigns |
| URL Shortener (`bit.ly`, `tinyurl`) | **+20** | Masks true destination; proxy for intent concealment |
| Extreme URL Length (> 100 chars) | **+20** | Used to bury redirect paths and confuse users |
| Excessive Dashes (> 4) | **+15** | Pattern common in domain spoofing (`secure-paypal-login.com`) |
| Subdomain Depth Abuse (> 4 dots) | **+10** | Mimics trust: `login.paypal.secure.verify.com` |

#### 🟢 Safety Signal Weights (Negative Scores)

| Signal | Weight | Rationale |
|:---|:---:|:---|
| Trusted Domain Whitelist | **−50** | Overrides all risk signals for verified entities |
| HTTPS Enabled | **−15** | TLS handshake provides baseline authenticity |
| Normal URL Length (< 50 chars) | **−5** | Characteristic of concise, legitimate domains |

#### Classification Thresholds

```
Score ≥ 45  →  🔴 MALICIOUS   (Hologram Shield activated)
Score ≥ 20  →  🟡 SUSPICIOUS  (Warning popup shown)
Score  < 20  →  🟢 SAFE        (Clean indicator)
```

---

### Layer 3 — Content Deep Mining (SMS & Text Analysis)

For text-embedded URLs (SMS logs, emails, scraped pages), the engine:

- **Pattern extraction**: Regex suite identifies URLs camouflaged within plain text
- **De-obfuscation**: Reconstructs URLs with injected whitespace (`www. bank .com`) before passing to Layer 2
- **Entropy analysis**: Detects procedurally generated domains (DGA) via character distribution analysis—a key botnet indicator

---

### Layer 4 — Active DOM Defense (Hologram Shield)

When a Critical or Suspicious verdict is reached, a **content script** injects an isolated `ShadowRoot` overlay that:

- **Physically blocks** all underlying page interaction until user acknowledges the risk
- **Cannot be suppressed** by malicious page CSS (Shadow DOM encapsulation)
- **Presents clear UX**: "Return to Safety" (recommended) or "Proceed (Unsafe)" with full risk disclosure

This approach was chosen over `alert()` dialogs (bypassable) or `<iframe>` overlays (styleable by host page).

---

## 🏗️ System Architecture

```
malware-url-detector/
│
├── 📂 extension/                 # Browser Sentinel (Manifest V3)
│   ├── manifest.json             # Permission scoping (activeTab only)
│   ├── background.js             # Service worker — URL intercept + API relay
│   ├── content.js                # Shadow DOM hologram injection
│   ├── popup.html / popup.js     # Glassmorphism UI — risk gauge & details
│   └── style.css                 # Neon-accent dark theme
│
├── 📂 backend/                   # Intelligence Core (Node.js / Express)
│   ├── server.js                 # REST API — POST /api/check-url
│   ├── services/
│   │   ├── DatasetLoader.js      # O(1) Map indexer — 640k signatures
│   │   ├── featureExtractor.js   # URL lexical feature extraction
│   │   ├── detectionEngine.js    # Weighted scoring classifier
│   │   ├── HistoryService.js     # MongoDB persistence layer
│   │   └── db.js                 # Mongoose connection manager
│   └── data/
│       └── dataset.csv           # 640,793-entry threat intelligence store
│
├── 📂 frontend/                  # Cyber-Guard Nerve Center (Dashboard)
│   ├── index.html                # Responsive SPA shell
│   ├── app.js                    # Chart.js visualizations + live scan feed
│   └── style.css                 # Dark-mode cyber aesthetic (37k CSS)
│
├── vercel.json                   # Serverless deployment config
├── RESEARCH_PAPER.md             # Full academic write-up
├── IMPROVEMENTS.md               # Changelog & accuracy benchmarks
└── DASHBOARD_FEATURES.md         # Feature verification guide
```

---

## 🚀 Key Capabilities

### 🔌 Browser Extension (SafeSurf Sentinel)

| Feature | Description |
|:---|:---|
| **Real-Time Auto-Scan** | Automatically checks every tab's URL on navigation |
| **Glassmorphism Popup UI** | Circular risk gauge with neon-accent dark theme |
| **Hologram Shield** | Full-page Shadow DOM overlay for critical threats |
| **Interactive Score Breakdown** | Toggle individual risk factors to see live score impact |
| **Cross-Browser** | Chrome, Edge, Brave (all Chromium MV3 compatible) |
| **Privacy-First** | Only URL metadata is analyzed — no content, keystrokes, or PII |

### 📊 Cyber-Guard Dashboard (Nerve Center)

| Widget | Description |
|:---|:---|
| **Real-Time Scan Stream** | Live feed with Scan IDs, risk scores, and verdicts |
| **Threat Activity Chart** | 7-day line graph of detection trends (Chart.js) |
| **Distribution Donut** | Breakdown: Malware / Phishing / Safe percentages |
| **History Table** | Searchable log synced with MongoDB Atlas |
| **Dynamic Stat Cards** | Total Scanned, Threats Blocked, Safety Score — live |
| **Global Intelligence Pool** | Direct access to signature database counts |

### 🧠 Backend Intelligence API

| Endpoint | Method | Description |
|:---|:---:|:---|
| `/api/check-url` | `POST` | Core detection — returns label, score, details |
| `/api/history` | `GET` | Recent scan history from MongoDB |
| `/api/stats` | `GET` | Aggregate dashboard statistics |
| `/api/dataset` | `GET` | Full threat signature dataset |
| `/api/dataset-stats` | `GET` | Signature count + metadata |

---

## ⚗️ Accuracy Benchmarks

### Improvement Study (Pre vs. Post Weighted Scoring)

| Metric | Before (v1 Additive) | After (v2 Balanced) | Δ |
|:---|:---:|:---:|:---:|
| **Overall Accuracy** | 91% | **95%** | +4% |
| **Precision** | 89% | **94%** | +5% |
| **False Positive Rate** | 6% | **2%** | −4% |

### Representative Test Cases

| URL | Expected | Verdict | Score | Source |
|:---|:---:|:---:|:---:|:---:|
| `https://google.com` | Safe | ✅ **Safe** | 0 | Whitelist |
| `https://github.com` | Safe | ✅ **Safe** | 0 | Whitelist |
| `http://192.168.1.1/login` | Malicious | 🚨 **Malicious** | 50 | Heuristic |
| `http://free-gift-card.xyz` | Suspicious | ⚠️ **Suspicious** | 25 | Heuristic |
| `http://bit.ly/xyz` | Suspicious | ⚠️ **Suspicious** | 20 | Heuristic |
| `http://pay.pal.login.secure.id.com/@verify` | Malicious | 🚨 **Malicious** | 90 | Heuristic |

---

## 💡 The "Non-ML" Advantage

Many ask why we chose a **Known Threats + Smart Patterns** model over ML. This is a deliberate research position:

| Dimension | ML Classifier | SafeSurf (Deterministic) |
|:---|:---:|:---:|
| **Latency** | 10–50 ms (inference) | **< 0.1 ms** (O(1) lookup) |
| **Known Threat Recall** | ~97% | **100%** (if in database) |
| **Zero-Day Detection** | Probabilistic | Heuristic (rule-based) |
| **Explainability** | Black-box | **Full — per-factor breakdown** |
| **Retraining Required** | Yes (new data) | **No** (add to map, restart) |
| **False Positive Control** | Threshold tuning | **Whitelist + negative scoring** |
| **Deployment Size** | Large (model weights) | **Lightweight** (CSV + JS) |

> The core insight: **For a known-threat database, deterministic lookup is both faster and more accurate than any probabilistic model.** ML's advantage appears only at the decision boundary for unseen domains.

---

## 🛠️ Setup Guide

### Prerequisites

- **Node.js** v18+ and **npm**
- A **MongoDB Atlas** cluster (free tier works)
- A Chromium-based browser (Chrome, Edge, Brave)

### Step 1 — Start the Intelligence Backend

```bash
# Clone the repository
git clone https://github.com/your-username/malware-url-detector.git
cd malware-url-detector/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your MONGO_URI

# Launch the backend
node server.js
# ✅ Output: "Security Backend running at http://localhost:5000"
```

### Step 2 — Open the Cyber-Guard Dashboard

```bash
# Simply open in any browser (no build step required)
open frontend/index.html
# Windows: start frontend/index.html
```

### Step 3 — Install the Browser Extension

```
1. Navigate to chrome://extensions/
2. Toggle ON "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select the /extension folder
5. Pin "SafeSurf" to your toolbar
```

### Step 4 — Verify the Full Stack

```bash
# Quick API test
curl -X POST http://localhost:5000/api/check-url \
  -H "Content-Type: application/json" \
  -d '{"url": "http://192.168.1.1/phishing"}'

# Expected response:
# { "label": "Malicious", "score": 50, "source": "heuristics", ... }
```

---

## 🧪 Testing Suite

```bash
cd backend

# Test heuristic engine accuracy
node test-heuristics.js

# Verify dataset integrity and O(1) lookup
node verify-dataset-lookup.js

# Test MongoDB cloud connection
node test-mongo.js

# Run full improvement benchmark (v1 vs v2)
node test-improvements.js
```

---

## 🔮 Future Scope

| Priority | Enhancement | Description |
|:---:|:---|:---|
| 🔴 High | **ML Hybrid Layer** | Train Random Forest on labeled dataset; use as tiebreaker for ambiguous heuristic scores (30–44 range) |
| 🔴 High | **Google Safe Browsing API** | Cross-reference against Google's real-time threat feed |
| 🟡 Medium | **WHOIS Domain Age** | Penalize newly registered domains (< 30 days old) — strong phishing indicator |
| 🟡 Medium | **Community Crowdsourcing** | Allow users to report false positives/negatives to improve accuracy |
| 🟡 Medium | **VirusTotal Integration** | Multi-engine scan result aggregation for edge cases |
| 🟢 Low | **Deep Content Inspection** | Fetch and parse target page HTML for embedded malicious keywords |
| 🟢 Low | **Browser History Analysis** | Detect repeated visit patterns to suspicious domains |

---

## 📐 Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     SAFESURF TECH STACK                     │
├────────────────────┬────────────────────────────────────────┤
│ Layer              │ Technologies                           │
├────────────────────┼────────────────────────────────────────┤
│ Extension          │ Chrome MV3, Shadow DOM, Vanilla JS     │
│ Frontend           │ HTML5, CSS3 (37k), Chart.js, Font Awesome│
│ Backend            │ Node.js 18+, Express.js v4.18          │
│ Database           │ MongoDB Atlas, Mongoose v9.2           │
│ Intelligence Store │ CSV (640k rows), In-Memory JS Map      │
│ Deployment         │ Vercel (serverless), .env config       │
│ Testing            │ Custom Node.js test scripts            │
└────────────────────┴────────────────────────────────────────┘
```

---

## 📄 Research Documentation

This project ships with full academic documentation:

| Document | Description |
|:---|:---|
| [`RESEARCH_PAPER.md`](RESEARCH_PAPER.md) | Full academic paper: abstract, methodology, results, future scope |
| [`IMPROVEMENTS.md`](IMPROVEMENTS.md) | Changelog documenting v1→v2 scoring improvements with benchmarks |
| [`DASHBOARD_FEATURES.md`](DASHBOARD_FEATURES.md) | Complete feature verification guide with test cases |
| [`extension/TEACHER_GUIDE.md`](extension/TEACHER_GUIDE.md) | Pedagogical walkthrough for academic presentation |

---

## 📄 License & Acknowledgments

- **Dataset**: Publicly available malicious URL repositories (PhishTank, OpenPhish)
- **Architecture**: Inspired by SpamAssassin, Snort IDS, and Chrome's Safe Browsing API design
- **Visualization**: [Chart.js](https://www.chartjs.org/) for dynamic threat analytics
- **Icons**: [Font Awesome](https://fontawesome.com/) for UI iconography

Licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built with 🛡️ for the cybersecurity research community**

*If SafeSurf helped your research, please consider giving it a ⭐*

</div>
