<div align="center">

# SafeSurf: A Deterministic Framework for Real-Time Phishing Detection in Web Browsers

**Nikhil Singh**  
Department of Computer Science and Information Technology Engineering  
Dronacharya Group of Institutions, Greater Noida, India  
📧 `nikhil.19324@gnindia.dronacharya.info`

---

[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Brave-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Manifest](https://img.shields.io/badge/Manifest-V3%20Compliant-success?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Cloud-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Intel](https://img.shields.io/badge/Threat%20DB-640k%2B%20Signatures-DC143C?style=for-the-badge&logo=databricks&logoColor=white)](#31-direct-blacklist-check)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

| 🎯 F1 Score | ⚡ Mean Latency | 🛡️ Threat Signatures | 📉 False Positive Rate |
|:-:|:-:|:-:|:-:|
| **97.1%** | **0.42 ms** | **640,793+** | **2%** |
| vs. CNN baseline 94.7% | 437× faster than CNN | PhishTank + OpenPhish | Post-whitelist scoring |

</div>

---

## Abstract

The proliferation of AI-generated phishing websites poses significant challenges for real-time browser security. Contemporary phishing detection systems predominantly rely on machine learning models, which incur substantial inference latency, require continuous retraining, consume considerable computational resources, and lack decision transparency. This paper presents **SafeSurf**, a deterministic web security framework engineered to identify phishing threats in **under one millisecond** via an O(1) hash-based lookup mechanism.

SafeSurf implements a **Quad-Layer Defense Architecture** comprising:
1. Real-time URL verification against a database of over 640,000 known malicious domains
2. Structural domain analysis using entropy-based randomness scoring, subdomain depth assessment, and TLD risk classification
3. Hidden URL reconstruction from webpage content
4. Tamper-resistant browser warnings rendered via Shadow DOM technology

Experimental evaluation on a balanced dataset of 10,000 URLs from PhishTank and Alexa Top Sites demonstrates a **precision of 97.8%, recall of 96.4%, and F1 score of 97.1%**, with mean detection latency of **0.42 ms** — two to three orders of magnitude faster than machine learning baselines. These results establish that deterministic methods can match or exceed machine learning-based systems for real-time browser security while offering full decision explainability.

**Keywords:** Phishing Detection · Deterministic Security · Browser Extension · Real-Time Threat Detection · Hash-Based Lookup · Cybersecurity

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Related Work](#2-related-work)
3. [Proposed Methodology](#3-proposed-methodology)
4. [Results and Evaluation](#4-results-and-evaluation)
5. [Discussion](#5-discussion)
6. [Conclusion and Future Work](#6-conclusion-and-future-work)
7. [References](#references)
8. [Project Structure](#project-structure)
9. [Setup Guide](#setup-guide)

---

## 1. Introduction

The rapid digitisation of financial services, enterprise cloud infrastructure, and federated identity systems has significantly expanded the attack surface available to adversaries. Phishing remains among the most pervasive and damaging cyber threats, with the Anti-Phishing Working Group (APWG) reporting over **1.3 million unique phishing sites** detected in 2023 alone [14]. Modern attackers leverage generative AI to produce convincing replica websites, rapidly rotate domains, manipulate subdomains, and obfuscate URLs — rendering traditional signature-based defences increasingly ineffective. Unlike legacy phishing campaigns, contemporary attacks often persist for only a few hours before the domain is abandoned, circumventing blocklists that cannot update fast enough.

Existing detection approaches broadly fall into two categories:

- **Blacklist-based systems** offer low latency and minimal resource consumption but suffer from a fundamental coverage gap: newly registered malicious domains evade detection until catalogued.
- **Machine learning systems** can generalise to unseen threats but introduce inference latency of 50–200 ms per request, require continuous retraining on evolving datasets, depend on substantial memory and compute resources, and produce opaque decisions that undermine user trust.

This paper addresses the gap between these extremes by proposing **SafeSurf** — a fully deterministic, browser-native phishing detection framework that combines O(1) hash-based domain verification with lightweight structural risk scoring. SafeSurf produces fully explainable, sub-millisecond decisions without any probabilistic inference, making it uniquely suitable for real-time deployment in resource-constrained browser environments.

### 1.1 Problem Statement

The core challenge is to construct a phishing detection system that operates in constant time, produces explainable decisions, and can identify both known malicious domains and structurally suspicious novel domains. Formally, a URL is represented as:

```
U = (Protocol, Domain, Subdomain, Path, TLD)
```

The system must classify each URL into one of three threat levels:

```
f(U) → {Safe, Suspicious, Critical}
```

Subject to the following constraints:
- O(1) lookup performance
- Operation entirely within the browser environment
- No dependence on machine learning inference or cloud-based processing
- Minimal CPU and memory utilisation
- Near-zero false negative rate for catalogued threats

### 1.2 Proposed Solution

SafeSurf resolves these constraints through two complementary mechanisms:

| Mechanism | Trigger | Operation | Latency |
|:---|:---|:---|:---:|
| **O(1) Hash Lookup** | Known domain | Blacklist `Set` membership check | < 0.1 ms |
| **Structural Risk Scorer** | Unknown domain | 3-factor weighted composite score | ~0.5 ms |

Suspicious domains trigger tamper-resistant browser-level warnings rendered via the Shadow DOM API. The complete system is packaged as a lightweight browser extension requiring no external dependencies.

---

## 2. Related Work

Phishing detection research spans three principal paradigms: signature-based, heuristic-based, and machine learning-based systems.

**Signature-based systems** maintain curated blacklists of known malicious URLs or domains. Google Safe Browsing [11] and PhishTank [12] exemplify this approach, providing rapid, low-overhead lookups. However, the fundamental weakness is their inability to detect zero-day threats — domains not yet catalogued. Whittaker et al. [9] demonstrated that even large-scale automated classification pipelines struggle to maintain coverage against rapidly rotating phishing infrastructure.

**Machine learning-based systems** were pioneered by Ma et al. [5], who applied lexical URL features with supervised classifiers to identify malicious sites. Subsequent work by Le et al. [4] introduced PhishDef, an adaptive online learning system. More recent approaches employ deep learning architectures including CNNs and Transformers, achieving high accuracy but at the cost of substantial inference latency [7]. Sahingoz et al. [7] reported that CNN-based models achieve up to 97.3% accuracy yet require **150–200 ms per query** — prohibitive for real-time browser deployment.

**Heuristic-based systems** analyse structural URL features — excessive subdomain depth, high-risk TLDs, or abnormal character distributions — to flag suspicious domains without labelled training data [8]. Garera et al. [3] formalised a framework for quantifying phishing URL characteristics. Hybrid systems combine blacklist verification with ML scoring [2], but still rely on models requiring periodic retraining.

> **SafeSurf** distinguishes itself from all prior work by eliminating probabilistic inference entirely. Unlike hybrid systems, it produces fully deterministic, explainable decisions at constant time — a property not demonstrated by any previously reported browser-based phishing detection system.

---

## 3. Proposed Methodology

SafeSurf prioritises sub-millisecond latency and fully reproducible decisions. The detection pipeline comprises two sequential stages: direct blacklist verification followed by structural risk scoring for domains not present in the blacklist.

### 3.1 Direct Blacklist Check

Let **D** denote the set of known malicious domains and **U** the input URL. Following normalisation:

```
Uₙ = normalize(U)   →  lowercase  →  strip protocol  →  strip path
```

If `Uₙ ∈ D`, the system immediately returns `f(U) = Critical`.

The domain set **D** is stored as a JavaScript `Set` object, providing **O(1) average-case lookup** via hash-based indexing. The current database contains **640,000 entries** sourced from PhishTank [12], OpenPhish [13], and APWG feeds [14], updated weekly.

### 3.2 Structural Risk Scoring for Unknown Domains

For domains not present in **D**, SafeSurf computes a composite risk score **R** from three structural features, each normalised to [0, 1]:

#### Feature 1 — Domain Randomness (H)

Character randomness is approximated via the ratio of unique characters to domain length:

```
H = |unique_chars(domain)| / |domain|
```

| Example | H Score | Interpretation |
|:---|:---:|:---|
| `paypal.com` | ≈ 0.55 | Normal — low diversity |
| `xj29akd83.xyz` | ≈ 0.89 | High — DGA signature |

#### Feature 2 — Subdomain Depth (S)

Phishing URLs frequently exploit deep subdomain chains. SafeSurf counts dot-delimited labels preceding the registered domain, capped at 5:

```
S = min(depth, 5) / 5
```

`secure.pay.login.verify.xyz` → depth = 4 → **S = 0.80**

#### Feature 3 — TLD Risk Score (T)

Predetermined risk values based on empirical threat feed analysis:

| TLD | Risk Score T |
|:---:|:---:|
| `.gq` | 0.90 |
| `.tk` | 0.85 |
| `.top` | 0.80 |
| `.xyz` | 0.70 |
| others | 0.20 |

#### Composite Risk Score

```
R = (0.4 × H) + (0.3 × S) + (0.3 × T)
```

> Weights were determined empirically through **5-fold cross-validation** on a development set of 2,000 labelled URLs, optimising for F1 score.

#### Classification Thresholds

```
R  < 0.4          →  🟢 Safe
0.4 ≤ R < 0.7    →  🟡 Suspicious   (Warning overlay shown)
R  ≥ 0.7          →  🔴 Critical     (Hologram Shield activated)
```

### 3.3 Detection Algorithm

```
Input: URL U
─────────────────────────────────────────────────
Step 1: Uₙ ← normalize(U)
Step 2: if Uₙ ∈ D  →  return Critical  [TERMINATE]
Step 3: Compute H (domain randomness)
Step 4: Compute S (subdomain depth)
Step 5: Compute T (TLD risk)
Step 6: R ← (0.4 × H) + (0.3 × S) + (0.3 × T)
Step 7: Assign threat class from thresholds
Step 8: if Suspicious or Critical  →  inject Shadow DOM overlay
Output: {Safe | Suspicious | Critical}
─────────────────────────────────────────────────
Deterministic: identical input always yields identical output.
```

### 3.4 Quad-Layer Defense Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  SAFESURF DETECTION PIPELINE                    │
│                                                                 │
│   URL Input                                                     │
│      │                                                          │
│      ▼                                                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  LAYER 1 — Direct Recognition (O(1) Blacklist Lookup)  │    │
│  │  640,000+ verified malicious domains  →  Hash Set      │    │
│  │  Match found? ──YES──► 🔴 CRITICAL  [TERMINATE]        │    │
│  └───────────────────────────┬────────────────────────────┘    │
│                              │ No match                         │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  LAYER 2 — Structural Risk Scoring                     │    │
│  │  H (randomness) + S (depth) + T (TLD) → Score R        │    │
│  │  R ≥ 0.7? ──YES──► 🔴 CRITICAL                         │    │
│  │  R ≥ 0.4? ──YES──► 🟡 SUSPICIOUS                       │    │
│  │  R  < 0.4? ─────► 🟢 SAFE                              │    │
│  └───────────────────────────┬────────────────────────────┘    │
│                              │ Suspicious / Critical            │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  LAYER 3 — Content Deep Mining                         │    │
│  │  Regex extraction + de-obfuscation of hidden URLs       │    │
│  │  Entropy analysis for DGA domain detection              │    │
│  └───────────────────────────┬────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  LAYER 4 — Active DOM Defense (Hologram Shield)        │    │
│  │  Shadow DOM overlay — tamper-proof, CSS-isolated        │    │
│  │  "Return to Safety" | "Proceed (Unsafe)"               │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Results and Evaluation

SafeSurf was evaluated against six baseline methods across four dimensions: detection accuracy, inference latency, memory footprint, and decision explainability.

**Evaluation Dataset**: 10,000 balanced URLs — 5,000 confirmed phishing URLs (PhishTank [12], OpenPhish [13]) and 5,000 benign URLs (Alexa Top 1 Million). 1,000 phishing URLs were withheld from the blacklist to force structural scoring evaluation.

**Hardware**: Intel Core i5-1135G7, 8 GB RAM, Google Chrome 124, averaged over 1,000 repeated classifications per method.

### 4.1 Detection Accuracy

**Table 1.** Detection accuracy and latency comparison.

| Method | Precision (%) | Recall (%) | F1 Score (%) | Avg Latency (ms) |
|:---|:---:|:---:|:---:|:---:|
| **SafeSurf (Ours)** | **97.8** | **96.4** | **97.1** | **0.42** |
| Random Forest [5] | 94.2 | 92.7 | 93.4 | 68.3 |
| SVM + Lexical [16] | 92.6 | 91.1 | 91.8 | 112.5 |
| CNN-based [7] | 95.1 | 94.3 | 94.7 | 183.6 |
| PhishDef [4] | 91.3 | 89.8 | 90.5 | 95.2 |
| Blacklist Only [9] | 88.5 | 72.3 | 79.6 | 0.38 |

Key findings:
- **False negative rate = 0%** for all blacklisted domains (unconditional Critical classification by design)
- **89.3%** of the 1,000 withheld zero-day phishing URLs correctly classified as Suspicious or Critical via structural scoring alone
- SafeSurf's F1 of 97.1% **exceeds all ML baselines** while delivering latency **437× lower** than CNN-based approaches

### 4.2 Latency and Resource Consumption

| Method | Avg Latency (ms) | Speedup vs. SafeSurf | Memory Footprint |
|:---|:---:|:---:|:---:|
| **SafeSurf — Blacklist hit** | **< 0.1** | — | 15 MB |
| **SafeSurf — Structural score** | **~0.5** | — | 15 MB |
| Random Forest [5] | 68.3 | 162× slower | ~80 MB |
| SVM + Lexical [16] | 112.5 | 268× slower | ~120 MB |
| CNN-based [7] | 183.6 | **437× slower** | ~300 MB |
| PhishDef [4] | 95.2 | 227× slower | ~150 MB |

> CPU utilisation remains **below 0.5%** during active browsing, measured via Chrome Task Manager across a 10-minute session.

### 4.3 Explainability and Maintenance

Every SafeSurf classification is **fully traceable** to one of four explicit causes:

| Cause | Example User-Facing Explanation |
|:---|:---|
| Direct blacklist match | *"Domain found in threat database (PhishTank)"* |
| High domain randomness | *"Character randomness H = 0.87 — probable DGA domain"* |
| Excessive subdomain depth | *"Subdomain depth = 4 — mimics trusted service"* |
| High-risk TLD | *"TLD `.xyz` — high empirical phishing correlation"* |

This transparency stands in direct contrast to ML classifiers, which operate as black boxes and cannot provide human-interpretable rationales for individual decisions. Maintenance requires only periodic blacklist updates — a simple data synchronisation operation. ML systems require full retraining cycles, hyperparameter re-optimisation, and model validation whenever the threat landscape shifts.

---

## 5. Discussion

The experimental results demonstrate that deterministic systems can achieve detection accuracy competitive with ML baselines while offering substantial advantages in latency, explainability, and operational simplicity.

**SafeSurf's F1 score of 97.1% exceeds all evaluated ML baselines** except CNN-based approaches (F1 = 94.7%), while delivering latency approximately **437× lower** — a trade-off that is unambiguously favourable for browser-based deployment where user experience is paramount.

**Principal limitation**: SafeSurf's efficacy is reduced against phishing pages employing structurally innocuous domain names — for example, legitimate-looking domains registered for a single short-lived campaign. The structural risk score may not reach the Critical threshold in such cases, resulting in false negatives. However, such advanced attacks represent a minority of real-world phishing attempts, which predominantly exhibit detectable structural anomalies [14].

**Decision transparency** confers practical benefits beyond performance metrics. Users who receive a SafeSurf warning accompanied by a clear explanation are better equipped to make informed security decisions than those confronted by an opaque ML-generated risk score. This aligns with the broader principle of explainable AI in security-critical applications.

**Operational stability**: The absence of retraining requirements eliminates a significant operational risk — model degradation over time as phishing techniques evolve. SafeSurf's performance is guaranteed to remain constant between blacklist updates, since no statistical model is involved. This property is particularly valuable in enterprise deployment contexts where model governance and auditability are required.

---

## 6. Conclusion and Future Work

This paper presented **SafeSurf**, a deterministic browser extension for real-time phishing detection combining O(1) hash-based blacklist lookup with structural domain risk scoring. Evaluated on 10,000 URLs against five baselines, SafeSurf achieves an **F1 score of 97.1%** with **mean detection latency of 0.42 ms** — outperforming all evaluated ML baselines on the speed-accuracy trade-off. All decisions are fully explainable and reproducible, with no inference variability, no retraining requirements, and a memory footprint of approximately **15 MB**.

### Directions for Future Work

| Priority | Enhancement | Description |
|:---:|:---|:---|
| 🔴 High | **Hybrid ML Layer** | Invoke lightweight ML semantic analysis when structural score falls in the Suspicious range (0.4–0.7) |
| 🔴 High | **DNS-Layer Scanning** | Intercept malicious domains before page load |
| 🟡 Medium | **Federated Threat Intelligence** | Cross-user threat sharing across SafeSurf networks |
| 🟡 Medium | **AI Form-Field Analysis** | Detect credential harvesting on benign-structured domains |
| 🟢 Low | **Mobile Browser Integration** | Platform-specific performance optimisations for iOS/Android |

SafeSurf demonstrates that deterministic approaches can provide effective, transparent, and high-performance protection against phishing — challenging the assumption that machine learning is a prerequisite for competitive modern cyber-defence.

---

## References

[1] Blum, A., Wardman, B., Solorio, T., Warner, G.: Learning to identify phishing websites. In: *Proc. WWW 2010*, pp. 649–658 (2010)

[2] Cao, Y., Han, W., Le, Y.: Anti-phishing based on automated individual whitelist. In: *Proc. 4th ACM Workshop on Digital Identity Management*, pp. 51–60 (2008)

[3] Garera, S., Provos, N., Chew, M., Rubin, A.D.: A framework for the detection and quantification of phishing attacks. In: *Proc. ACM Workshop on Recurring Malcode*, pp. 1–8 (2007)

[4] Le, A., Markopoulou, A., Faloutsos, M.: PhishDef: URL names say it all. In: *Proc. IEEE INFOCOM*, pp. 1916–1924 (2011)

[5] Ma, J., Saul, L.K., Savage, S., Voelker, G.M.: Beyond blacklists: Learning to detect malicious web sites from suspicious URLs. In: *Proc. 15th ACM SIGKDD*, pp. 1245–1254 (2009)

[6] Sahoo, D., Liu, C., Hoi, S.C.H.: Malicious URL detection using machine learning: A survey. *arXiv:1701.07179* (2017)

[7] Sahingoz, O.K., Buber, E., Demir, O., Diri, B.: Machine learning based phishing detection from URLs. *Expert Systems with Applications* 117, 345–357 (2019)

[8] Verma, R., Das, A.: What's in a URL: Fast feature extraction and malicious URL detection. In: *Proc. 3rd ACM International Workshop on Security and Privacy Analytics*, pp. 55–63 (2017)

[9] Whittaker, C., Ryner, B., Nazif, M.: Large-scale automatic classification of phishing pages. In: *Proc. NDSS* (2010)

[10] Zhang, Y., Egelman, S., Cranor, L., Hong, J.: Phinding phish: Evaluating anti-phishing tools. In: *Proc. NDSS* (2007)

[11] Google: Safe Browsing API Documentation. https://developers.google.com/safe-browsing (2025)

[12] PhishTank: Community Phishing Data Repository. https://www.phishtank.com (2025)

[13] OpenPhish: Phishing Intelligence Feed. https://openphish.com (2025)

[14] Anti-Phishing Working Group (APWG): Phishing Activity Trends Report, Q4 2023. https://apwg.org (2023)

[15] Almomani, A., et al.: A survey of phishing email filtering techniques. *IEEE Communications Surveys & Tutorials* 15(4), 2070–2090 (2013)

[16] Jain, A.K., Gupta, B.B.: A novel approach to protect against phishing attacks at client side using auto-updated white-list. *EURASIP Journal on Information Security* 2016(1), 1–11 (2016)

[17] Khonji, M., Iraqi, Y., Jones, A.: Phishing detection: A literature survey. *IEEE Communications Surveys & Tutorials* 15(4), 2091–2121 (2013)

[18] Mohammad, R.M., Thabtah, F., McCluskey, L.: Predicting phishing websites based on self-structuring neural network. *Neural Computing and Applications* 25(2), 443–458 (2014)

---

## Project Structure

```
malware-url-detector/
│
├── 📂 extension/                 # Browser Sentinel (Manifest V3)
│   ├── manifest.json             # Permission scoping (activeTab only)
│   ├── background.js             # Service worker — URL intercept + API relay
│   ├── content.js                # Shadow DOM hologram injection (Layer 4)
│   ├── popup.html / popup.js     # Glassmorphism risk gauge UI
│   └── style.css                 # Neon-accent dark theme
│
├── 📂 backend/                   # Intelligence Core (Node.js / Express)
│   ├── server.js                 # REST API  →  POST /api/check-url
│   ├── services/
│   │   ├── DatasetLoader.js      # O(1) Map indexer — 640k signatures  (Layer 1)
│   │   ├── featureExtractor.js   # H, S, T feature extraction           (Layer 2)
│   │   ├── detectionEngine.js    # Weighted composite scorer            (Layer 2)
│   │   ├── HistoryService.js     # MongoDB cloud persistence
│   │   └── db.js                 # Mongoose connection manager
│   └── data/
│       └── dataset.csv           # 640,793-entry threat intelligence store
│
├── 📂 frontend/                  # Cyber-Guard Nerve Center (Dashboard)
│   ├── index.html                # Responsive SPA shell
│   ├── app.js                    # Chart.js visualisations + live scan feed
│   └── style.css                 # Dark-mode cyber aesthetic
│
└── vercel.json                   # Serverless deployment config
```

---

## Setup Guide

### Prerequisites

- **Node.js** v18+ and **npm**
- A **MongoDB Atlas** cluster (free tier sufficient)
- Any Chromium browser (Chrome, Edge, Brave)

### Step 1 — Start the Intelligence Backend

```bash
git clone https://github.com/nikhil6393/SAFESURF-A-Deterministic-Framework-for-Real-Time-Phishing-Detection-in-Web-Browsers.git
cd malware-url-detector/backend
npm install

# Add your MongoDB connection string
echo "MONGO_URI=your_connection_string_here" > .env

node server.js
# ✅  Security Backend running at http://localhost:5000
```

### Step 2 — Open the Dashboard

```bash
# Open directly in any browser — no build step required
start frontend/index.html
```

### Step 3 — Install the Browser Extension

```
1. Navigate to  chrome://extensions/
2. Enable  "Developer mode"  (top-right toggle)
3. Click  "Load unpacked"
4. Select the  /extension  folder
5. Pin "SafeSurf" to your browser toolbar
```

### Step 4 — Verify the Stack

```bash
curl -X POST http://localhost:5000/api/check-url \
  -H "Content-Type: application/json" \
  -d '{"url": "http://192.168.1.1/login"}'

# Expected: { "label": "Malicious", "score": 50, "source": "heuristics" }
```

### API Reference

| Endpoint | Method | Description |
|:---|:---:|:---|
| `/api/check-url` | `POST` | Core detection — returns `label`, `score`, `details` |
| `/api/history` | `GET` | Recent scan history from MongoDB |
| `/api/stats` | `GET` | Aggregate dashboard statistics |
| `/api/dataset` | `GET` | Full threat signature dataset |
| `/api/dataset-stats` | `GET` | Signature count + metadata |

---

<div align="center">

**Built with 🛡️ for the cybersecurity research community**

*Dronacharya Group of Institutions · Greater Noida, India · 2025*

*If SafeSurf helped your research, please consider giving it a ⭐*

</div>
