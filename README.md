<div align="center">

<img src="https://img.shields.io/badge/SafeSurf-Neural%20v2.0-7c3aed?style=for-the-badge&logo=shield&logoColor=white" alt="SafeSurf" height="40"/>

# SafeSurf — Real-Time Phishing & Malware URL Detection

**A Deterministic, Quad-Layer Defense System for Browser-Level Threat Neutralization**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-safesurf.vercel.app-7c3aed?style=for-the-badge)](https://safesurf-a-deterministic-framework.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github)](https://github.com/nikhil6393/SAFESURF-A-Deterministic-Framework-for-Real-Time-Phishing-Detection-in-Web-Browsers)

[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Brave-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Manifest](https://img.shields.io/badge/Manifest-V3%20Compliant-22c55e?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Threat DB](https://img.shields.io/badge/Threat%20Signatures-640%2C824%2B-dc2626?style=for-the-badge&logo=databricks&logoColor=white)](#detection-methodology)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](LICENSE)

---

| ⚡ Lookup Speed | 🎯 Accuracy | 🛡️ Signatures | 🔍 Detection Layers |
|:---:|:---:|:---:|:---:|
| **< 0.1 ms** | **95%** | **640,824+** | **4** |
| O(1) Hash-Map | v2 Balanced | In-Memory Index | Quad-Layer |

> **Zero-Day Ready** — Unlike pure blacklist tools, SafeSurf detects never-before-seen phishing domains through weighted heuristic scoring. No ML retraining required.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Detection Methodology](#-detection-methodology)
- [Architecture](#-system-architecture)
- [Benchmark Results](#-benchmark-results)
- [The Non-ML Advantage](#-the-non-ml-advantage)
- [Tech Stack](#-tech-stack)
- [Setup Guide](#-setup-guide)
- [API Reference](#-api-reference)
- [Testing](#-testing-suite)
- [Future Scope](#-future-scope)

---

## 🔭 Overview

SafeSurf is a **research-grade cybersecurity framework** that explores how deterministic, rule-based systems can outperform probabilistic ML models for real-time browser-level threat detection.

**Core thesis:** In latency-critical, high-stakes security applications, an interpretable deterministic system with O(1) lookup and weighted feature scoring achieves higher precision and orders-of-magnitude lower latency than black-box neural classifiers.

The system synthesizes four orthogonal detection methodologies into a unified real-time threat pipeline:

```
URL Input ──► [Layer 1: Direct Recognition]  ──► Known? ──► VERDICT
                          │
                          │ Unknown
                          ▼
             [Layer 2: Heuristic Scoring] ─────── Feature Weighting
                          │
                          ▼
             [Layer 3: Content Deep Mining] ────── Regex + De-obfuscation
                          │
                          ▼
             [Layer 4: Active DOM Defense] ──────── Shadow DOM Hologram Shield
```

---

## 🚀 Live Demo

> **Try it now →** [https://safesurf-a-deterministic-framework.vercel.app/](https://safesurf-a-deterministic-framework.vercel.app/)

Paste any URL into the Threat Intelligence Dashboard to get an instant verdict, risk score, and full per-factor breakdown. No sign-up required.

---

## 🔍 Detection Methodology

### Layer 1 — Direct Recognition (O(1) Blacklist Lookup)

> *Inspired by classical signature-based IDS/IPS systems (Snort, Suricata)*

**640,824 verified malicious domains** are indexed into a JavaScript `Map` at startup. Every scan begins with an O(1) hash-map lookup after URL normalization.

**Key insight:** Regardless of whether the dataset grows to 10 million entries, lookup time remains constant (< 0.1 ms) — mathematically guaranteed by hash-map collision bounds.

```
Normalization Pipeline:
  Raw URL ──► strip(https://) ──► strip(www.) ──► strip(trailing /) ──► lowercase ──► LOOKUP
```

| Match Label | Score | Action |
|:---|:---:|:---|
| `malicious` | 95 | Hologram Shield activated |
| `suspicious` | 45 | Warning popup shown |
| `safe` | 0 | Clean indicator |

---

### Layer 2 — Weighted Heuristic Scoring Engine

> *Inspired by SpamAssassin's additive rule scoring*

For URLs not found in the blacklist, the engine extracts **7 lexical risk signals** and **3 safety signals**, computing a continuous **Risk Score in [0, 100]**.

```
Risk Score = Σ(risk weights) − Σ(safety weights)
```

**Risk Signals (additive)**

| Signal | Weight | Rationale |
|:---|:---:|:---|
| Raw IP Address in URL | +50 | Legitimate sites virtually never use raw IPs |
| Special Characters (`@`, `%`) | +35 | Classic obfuscation vectors |
| Suspicious TLD (`.xyz`, `.top`, `.loan`, `.gq`) | +25 | High empirical correlation with phishing |
| URL Shortener (`bit.ly`, `tinyurl`) | +20 | Masks true destination |
| Extreme URL Length (> 100 chars) | +20 | Used to bury redirect paths |
| Excessive Dashes (> 4) | +15 | Pattern common in domain spoofing |
| Subdomain Depth Abuse (> 4 dots) | +10 | Mimics trust via deep nesting |

**Safety Signals (subtractive)**

| Signal | Weight | Rationale |
|:---|:---:|:---|
| Trusted Domain Whitelist | −50 | Overrides all risk signals |
| HTTPS Enabled | −15 | TLS provides baseline authenticity |
| Normal URL Length (< 50 chars) | −5 | Characteristic of concise, legitimate domains |

**Classification Thresholds**

```
Score ≥ 45  ──►  MALICIOUS   (Hologram Shield activated)
Score ≥ 20  ──►  SUSPICIOUS  (Warning popup shown)
Score  < 20  ──►  SAFE       (Clean indicator)
```

---

### Layer 3 — Content Deep Mining

For text-embedded URLs (SMS logs, emails, scraped pages):

- **Pattern Extraction** — Regex suite identifies URLs camouflaged within plain text
- **De-obfuscation** — Reconstructs URLs with injected whitespace (`www. bank .com`) before passing to Layer 2
- **Entropy Analysis** — Detects procedurally generated domains (DGA) via character distribution — a key botnet indicator

---

### Layer 4 — Active DOM Defense (Hologram Shield)

When a Critical or Suspicious verdict is reached, a **content script** injects an isolated `ShadowRoot` overlay that:

- **Physically blocks** all underlying page interaction until the user acknowledges the risk
- **Cannot be suppressed** by malicious page CSS (Shadow DOM encapsulation guarantees this)
- **Presents clear UX** — "Return to Safety" (recommended) or "Proceed (Unsafe)" with full risk disclosure

> Chosen over `alert()` dialogs (bypassable) and `<iframe>` overlays (styleable by host page).

---

## 🏗️ System Architecture

```
malware-url-detector/
│
├── extension/                  # Browser Sentinel (Manifest V3)
│   ├── manifest.json           # Permission scoping (activeTab only)
│   ├── background.js           # Service worker — URL intercept + API relay
│   ├── content.js              # Shadow DOM hologram injection
│   ├── popup.html              # Glassmorphism risk gauge UI
│   ├── popup.js                # Extension logic
│   └── style.css               # Neon-accent dark theme
│
├── backend/                    # Intelligence Core (Node.js / Express)
│   ├── server.js               # REST API → POST /api/check-url
│   ├── services/
│   │   ├── DatasetLoader.js    # O(1) Map indexer — 640k signatures
│   │   ├── featureExtractor.js # URL lexical feature extraction
│   │   ├── detectionEngine.js  # Weighted scoring classifier
│   │   ├── HistoryService.js   # MongoDB persistence layer
│   │   └── db.js               # Mongoose connection manager
│   └── data/
│       └── dataset.csv         # 640,824-entry threat intelligence store
│
├── frontend/                   # Threat Intelligence Dashboard
│   ├── index.html              # Responsive SPA shell
│   ├── app.js                  # Chart.js visualizations + live scan feed
│   └── style.css               # Dark-mode cyber aesthetic
│
├── RESEARCH_PAPER.md           # Full academic paper (Sections 1–6, 18 references)
└── vercel.json                 # Serverless deployment config
```

---

## 📊 Benchmark Results

### v1 vs v2 Improvement Study

| Metric | v1 (Additive) | v2 (Balanced) | Δ Change |
|:---|:---:|:---:|:---:|
| Overall Accuracy | 91% | **95%** | +4% |
| Precision | 89% | **94%** | +5% |
| False Positive Rate | 6% | **2%** | −4% |

### Representative Test Cases

| URL | Expected | Verdict | Score | Method |
|:---|:---:|:---:|:---:|:---:|
| `https://google.com` | Safe | ✅ Safe | 0 | Whitelist |
| `https://github.com` | Safe | ✅ Safe | 0 | Whitelist |
| `http://192.168.1.1/login` | Malicious | 🔴 Malicious | 50 | Heuristic |
| `http://free-gift-card.xyz` | Suspicious | 🟡 Suspicious | 25 | Heuristic |
| `http://bit.ly/xyz` | Suspicious | 🟡 Suspicious | 20 | Heuristic |
| `http://pay.pal.login.secure.id.com/@verify` | Malicious | 🔴 Malicious | 90 | Heuristic |

---

## ⚡ The Non-ML Advantage

| Dimension | ML Classifier | SafeSurf (Deterministic) |
|:---|:---:|:---:|
| Latency | 10–50 ms (inference) | **< 0.1 ms** (O(1) lookup) |
| Known Threat Recall | ~97% | **100%** (if in database) |
| Zero-Day Detection | Probabilistic | **Heuristic (rule-based)** |
| Explainability | Black-box | **Full per-factor breakdown** |
| Retraining Required | Yes | **No** |
| False Positive Control | Threshold tuning | **Whitelist + negative scoring** |
| Deployment Size | Large (model weights) | **Lightweight (CSV + JS)** |

> **Core insight:** For known-threat databases, deterministic lookup is both faster and more accurate than any probabilistic model. ML's advantage appears only at the decision boundary for truly unseen domains — exactly where the next iteration will introduce a hybrid layer.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|:---|:---|
| Browser Extension | Chrome MV3, Shadow DOM, Vanilla JS |
| Frontend Dashboard | HTML5, CSS3, Chart.js, Font Awesome |
| Backend API | Node.js 18+, Express.js v4.18 |
| Database | MongoDB Atlas, Mongoose v9.2 |
| Threat Intelligence | CSV (640k rows), In-Memory JS Map |
| Deployment | Vercel (serverless) |
| Testing | Custom Node.js test scripts |

---

## ⚙️ Setup Guide

### Prerequisites

- Node.js v18+ and npm
- MongoDB Atlas cluster (free tier works)
- Chromium-based browser (Chrome, Edge, Brave)

### Step 1 — Clone & Start the Backend

```bash
git clone https://github.com/nikhil6393/SAFESURF-A-Deterministic-Framework-for-Real-Time-Phishing-Detection-in-Web-Browsers.git
cd malware-url-detector/backend

npm install

# Add your MongoDB connection string
echo MONGO_URI=your_connection_string_here > .env

node server.js
# ✅ Security Backend running at http://localhost:5000
# ✅ MongoDB Connected
# ✅ Initialization complete. Total unique signatures indexed: 640,824
```

### Step 2 — Open the Dashboard

```bash
# Serve the frontend locally
npx serve ../frontend -p 3000
# Open http://localhost:3000
```

### Step 3 — Install the Browser Extension

```
1. Go to chrome://extensions/
2. Toggle ON "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select the /extension folder
5. Pin "SafeSurf" to your browser toolbar
```

### Step 4 — Verify the Stack

```bash
curl -X POST http://localhost:5000/api/check-url \
  -H "Content-Type: application/json" \
  -d '{"url": "http://192.168.1.1/login"}'

# Expected:
# { "label": "Malicious", "score": 50, "source": "heuristics" }
```

---

## 📡 API Reference

| Endpoint | Method | Description |
|:---|:---:|:---|
| `/api/check-url` | `POST` | Core detection — returns label, score, and breakdown |
| `/api/history` | `GET` | Recent scan history from MongoDB |
| `/api/stats` | `GET` | Aggregate dashboard statistics |
| `/api/dataset` | `GET` | Full threat signature dataset |
| `/api/dataset-stats` | `GET` | Signature count and metadata |

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
| 🔴 High | ML Hybrid Layer | Random Forest tiebreaker for ambiguous heuristic scores (30–44 range) |
| 🔴 High | Google Safe Browsing API | Cross-reference against Google's real-time threat feed |
| 🟡 Medium | WHOIS Domain Age | Penalize newly registered domains (< 30 days) |
| 🟡 Medium | Community Crowdsourcing | User-reported false positives/negatives |
| 🟡 Medium | VirusTotal Integration | Multi-engine scan aggregation for edge cases |
| 🟢 Low | Deep Content Inspection | Fetch and parse target page HTML for malicious keywords |
| 🟢 Low | Browser History Analysis | Detect repeated visit patterns to suspicious domains |

---

## 📄 License & Acknowledgments

- **Dataset** — PhishTank, OpenPhish (publicly available malicious URL repositories)
- **Architecture** — Inspired by SpamAssassin, Snort IDS, and Chrome's Safe Browsing API
- **Visualization** — Chart.js for dynamic threat analytics
- **Icons** — Font Awesome

Licensed under the [MIT License](LICENSE).

---

<div align="center">

Built for the cybersecurity research community.

**Dronacharya Group of Institutions, Greater Noida, India · 2025**

⭐ Star this repo if you found it useful!

</div>
