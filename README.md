# 🛡️ SAFESURF: A Deterministic Framework for Real-Time Phishing Detection in Web Browsers

**SafeSurf** is your personal 24/7 cyber security guard. While you browse the web, it works silently in the background to protect you from scams, fake login pages (phishing), and malicious links. **If a threat is detected (even a minor suspicion), it instantly shows a Red Warning Popup**, ensuring you are alerted before you proceed. 

It utilizes a **Quad-Layer Defense** strategy: Direct Recognition (640k+ Known Threats), Local Behavioral Analysis, Deep Content Parsing, and a centralized Intelligence Dashboard.

 # These are the badge linkes used in the project

[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Brave-blue)](https://chrome.google.com/webstore)
[![Database](https://img.shields.io/badge/Intel-640k%20Known%20Threats-indigo)](file:///e:/all%20projects/nikhilextentionforresearch/malware-url-detector/backend/data/)
[![History](https://img.shields.io/badge/Storage-MongoDB%20Cloud-green)](#-your-personal-security-command-center)
---

### 🧩 Architecture Behind the Badges
*   **Platform (Chrome | Edge | Brave)**: Built on the **Manifest V3** standard using cross-browser APIs (`chrome.runtime`, `chrome.webRequest`), ensuring native performance on all Chromium browsers without code changes.
*   **Intel (640k+ Known Threats)**: Utilizes a custom **O(1) In-Memory Map** to index over 640,000 confirmed malicious sites locally. This guarantees **sub-millisecond (<0.1ms) lookup speeds**, regardless of database size.
*   **Storage (MongoDB Cloud)**: A hybrid persistence layer using **Mongoose**. While the extension caches locally for speed, every scan is asynchronously synced to a **MongoDB Cluster** for long-term security auditing and global threat intelligence.

---

## 🚀 Key Features at a Glance
*   **Real-Time Active Alerts**: Automatically shows a "Hologram Shield" warning popup for ANY detected threat (Critical or Suspicious).
*   **Smart Threat Prediction**: Detects never-before-seen phishing sites by analyzing URL structure, TLDs, and keywords.
*   **Massive Threat Database**: Localized indexing of 640k+ known threats with O(1) lookup speed.
*   **Cloud-Synced History**: All scan results are securely logged to a MongoDB cloud database for long-term tracking.
*   **Premium Dark-Mode Dashboard**: A futuristic "Cyber-Guard" interface to visualize threat trends and activity.
*   **Cross-Platform Ready**: Fully compatible with Chrome, Edge, Brave, and other Chromium-based browsers.

---
## 🧐 How It Protects You (The Triple-Check System)

SafeSurf doesn't just guess; it uses three layers of defense to keep you safe:

### 1. 📋 The "Most Wanted" List (Direct Recognition)
We maintain a massive database of over **640,793 verified malicious domains**. 
*   **The Analogy:** Imagine a security guard at a building with a book of photos of every known shoplifter. 
*   **The Tech:** We use **O(1) Time Complexity** Map indexing. Regardless of whether the dataset grows to 10 million items, the search time remains constant, ensuring sub-millisecond lookups (<0.1ms).
*   **Normalization:** Our algorithm "cleans" URLs before comparison, stripping `https://`, `www.`, and trailing slashes to prevent attackers from using simple variations to bypass the list.

### 2. 🕵️ The "Detective Brain" (Smart Detective Mode)
Scammers create thousands of new sites every day. To catch these "new" threats, SafeSurf uses a smart detection engine that looks for red flags:
*   **Lexical Character Entropy:** Analyzes character distribution to detect procedurally generated domains (DGA) used by botnets.
*   **Structural Weighting:** Assigns risk based on "Subdomain Depth." A URL like `pay.pal.login.secure.id-verify.com` is flagged for its suspicious structure.
*   **TLD Reputation:** Maintains a dynamic risk table for Top-Level Domains (TLDs). "Dark-neighborhoods" like `.top`, `.xyz`, and `.gq` are assigned higher baseline threat coefficients.
*   **Trusted Whitelist (Safety Credits)**: We don't just look for bad; we verify the good. Known legitimate sites (Google, GitHub, etc.) and secure protocols (HTTPS) receive "Safety Credits" (negative scores) to prevent false alarms.

### 3. 🧪 Content Deep Mining (SMS & Text Mining)
We also look *inside* messages and text for hidden traps.
*   **Pattern Finding:** Uses a refined Regular Expression (Regex) suite to identify URLs hidden within plain text, SMS logs, or emails.
*   **De-masking:** If a link is typed like `www. bank .com` (with extra spaces), SafeSurf's de-obfuscation logic reconstructs and scans it anyway.

### 4. 🛑 Instant Hologram Warning (New!)
SafeSurf doesn't just warn you; it **alerts you instantly**.
*   **Automatic Threat Neutralization**: If a site scores as "Critical" OR "Suspicious", SafeSurf immediately opens a high-priority, full-screen **Red Hologram Warning**.
*   **Shadow-DOM Technology**: The warning shield is isolated in a "Shadow DOM," meaning malicious websites cannot hide or modify the warning using their own CSS.
*   **User Choice**: You are given a clear choice: "Return to Safety" (Recommended) or **click "Proceed (Unsafe)" to instantly remove the popup** and continue browsing.

---

### 🛡️ Cyber-Guard Security Dashboard
The project features a completely redesigned, **Dark Mode** "Cyber-Guard" dashboard for a premium, high-tech experience.
*   **Real-Time Security Stream**: Watch live as URLs are analyzed with unique scan IDs and detailed risk metrics.
*   **Global Intelligence Pool**: Direct visual access to the underlying threat database and signature counts.
*   **Fail-Safe Architecture**: Built with robust error handling that maintains UI integrity even if backend connectivity is intermittent.
*   **Dynamic Visualizations**: Integrated with Chart.js to provide meaningful trends on threat velocity and risk categorization.

> [!NOTE]
> The dashboard now utilizes **Cyber-Guard v2**, which prioritizes real-time data synchronization. Your "Total Analysis" count will reflect actual usage stored in the cloud database.

---

## 🛠️ The "Non-ML" Advantage: Why No Machine Learning?

Many ask why we chose a **Known Threats + Smart Patterns** model over standard **Machine Learning**:
1. **Deterministic Accuracy:** ML models "guess." If a known phishing URL is in our database, we are **100% guaranteed** to alert you.
2. **Infinite Speed:** Running a Deep Learning model takes 10-50ms. Our Map lookup takes **<0.1ms**.
3. **No Training Latency:** Adding new threats is instant on restart—no "re-training" required.
4. **Explainability:** When we warn you about a site, we can tell you EXACTLY why (e.g., "Found in Malicious Dataset") instead of it being a "Black Box."

---

## 📂 Project Structure

```text
malware-url-detector/
├── extension/          # Browser Sentinel (Manifest V3)
├── backend/            # Multi-Source Brain (640k+ Signatures)
│   ├── services/       # DatasetLoader, DetectionEngine, FeatureExtractor
│   └── data/           # Intelligence Store (dataset.csv)
├── frontend/           # Premium "Nerve Center" Dashboard
└── RESEARCH_PAPER.md   # Architectural Baseline & Future ML Scope
```

---

## 🛠️ Setup Guide (3 Simple Steps)

### Step 1: Start the "Brain" (Backend)
This is the powerhouse that processes all the data.
1. `cd backend`
2. `npm install`
3. `node server.js`

### Step 2: Open the Dashboard (Frontend)
- Open `frontend/index.html` in any browser.

### Step 3: Install the Extension
1. Open `chrome://extensions/`
2. Turn on **Developer Mode**.
3. Click **Load Unpacked** and select the `extension` folder.


