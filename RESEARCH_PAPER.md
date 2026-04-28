# SafeSurf: A Deterministic Framework for Real-Time Phishing Detection in Web Browsers

**Nikhil Singh**  
Department of Computer Science and Information Technology Engineering  
Dronacharya Group of Institutions, Greater Noida, India  
Corresponding author: nikhil.19324@gnindia.dronacharya.info

---

## Abstract

The proliferation of AI-generated phishing websites poses significant challenges for real-time browser security. Contemporary phishing detection systems predominantly rely on machine learning models, which incur substantial inference latency, require continuous retraining, consume considerable computational resources, and lack decision transparency. This paper presents SafeSurf, a deterministic web security framework engineered to identify phishing threats in under one millisecond via an O(1) hash-based lookup mechanism. SafeSurf implements a Quad-Layer Defense Architecture comprising: (1) real-time URL verification against a database of over 640,000 known malicious domains, (2) structural domain analysis using entropy-based randomness scoring, subdomain depth assessment, and TLD risk classification, (3) hidden URL reconstruction from webpage content, and (4) tamper-resistant browser warnings rendered via Shadow DOM technology. Experimental evaluation on a balanced dataset of 10,000 URLs from PhishTank and Alexa Top Sites demonstrates a precision of 97.8%, recall of 96.4%, and F1 score of 97.1%, with mean detection latency of 0.42 ms — two to three orders of magnitude faster than machine learning baselines. These results establish that deterministic methods can match or exceed machine learning-based systems for real-time browser security while offering full decision explainability.

**Keywords:** Phishing Detection · Deterministic Security · Browser Extension · Real-Time Threat Detection · Hash-Based Lookup · Cybersecurity

---

## 1. Introduction

### 1.1 Background

The rapid digitisation of financial services, enterprise cloud infrastructure, and federated identity systems has significantly expanded the attack surface available to adversaries. Phishing remains among the most pervasive and damaging cyber threats, with the Anti-Phishing Working Group (APWG) reporting over 1.3 million unique phishing sites detected in 2023 alone [14]. Modern attackers leverage generative AI to produce convincing replica websites, rapidly rotate domains, manipulate subdomains, and obfuscate URLs — rendering traditional signature-based defences increasingly ineffective. Unlike legacy phishing campaigns, contemporary attacks often persist for only a few hours before the domain is abandoned, circumventing blocklists that cannot update fast enough.

Existing detection approaches broadly fall into two categories. Blacklist-based systems offer low latency and minimal resource consumption but suffer from a fundamental coverage gap: newly registered malicious domains evade detection until catalogued. Machine learning systems can generalise to unseen threats but introduce inference latency of 50–200 ms per request, require continuous retraining on evolving datasets, depend on substantial memory and compute resources, and produce opaque decisions that undermine user trust. Deploying heavyweight models directly within browsers imposes unacceptable performance penalties on end-user experience.

This paper addresses the gap between these extremes by proposing SafeSurf — a fully deterministic, browser-native phishing detection framework that combines O(1) hash-based domain verification with lightweight structural risk scoring. SafeSurf produces fully explainable, sub-millisecond decisions without any probabilistic inference, making it uniquely suitable for real-time deployment in resource-constrained browser environments.

### 1.2 Problem Statement

The core challenge is to construct a phishing detection system that operates in constant time, produces explainable decisions, and can identify both known malicious domains and structurally suspicious novel domains. Formally, a URL is represented as:

```
U = (Protocol, Domain, Subdomain, Path, TLD)
```

The system must classify each URL into one of three threat levels:

```
f(U) → {Safe, Suspicious, Critical}
```

Subject to the following constraints: O(1) lookup performance; operation entirely within the browser environment; no dependence on machine learning inference or cloud-based processing; minimal CPU and memory utilisation; and a near-zero false negative rate for catalogued threats.

### 1.3 Proposed Solution

SafeSurf resolves these constraints through two complementary mechanisms. For known threats, an in-memory hash set enables O(1) domain lookup: if the normalised domain matches any entry in the malicious domain database, it is immediately classified as Critical with zero additional computation. For unknown domains — those absent from the blacklist — a rapid three-factor structural risk score is computed using domain character randomness, subdomain depth, and TLD risk, all without machine learning. Suspicious domains trigger tamper-resistant browser-level warnings rendered via the Shadow DOM API. The complete system is packaged as a lightweight browser extension requiring no external dependencies.

---

## 2. Related Work

Phishing detection research spans three principal paradigms: signature-based, heuristic-based, and machine learning-based systems.

Signature-based systems maintain curated blacklists of known malicious URLs or domains. Google Safe Browsing [11] and PhishTank [12] exemplify this approach, providing rapid, low-overhead lookups. However, the fundamental weakness of blacklist-based methods is their inability to detect zero-day threats — domains that have not yet been catalogued. Whittaker et al. [9] demonstrated that even large-scale automated classification pipelines struggle to maintain coverage against rapidly rotating phishing infrastructure.

Machine learning-based systems were pioneered by Ma et al. [5], who applied lexical URL features with supervised classifiers to identify malicious sites. Subsequent work by Le et al. [4] introduced PhishDef, an adaptive online learning system exploiting statistical URL patterns. Blum et al. [1] investigated structural and content-based attributes for phishing page classification. More recent approaches employ deep learning architectures including CNNs and Transformers, achieving high accuracy but at the cost of substantial inference latency and computational overhead [7]. Sahingoz et al. [7] reported that CNN-based models achieve up to 97.3% accuracy yet require 150–200 ms per query — prohibitive for real-time browser deployment. Sahoo et al. [6] surveyed machine learning approaches for malicious URL detection, noting the persistent tension between model expressiveness and deployment practicality.

Heuristic-based systems analyse structural URL features — such as excessive subdomain depth, use of high-risk TLDs, or abnormal character distributions — to flag suspicious domains without relying on labelled training data [8]. Garera et al. [3] formalised a framework for quantifying phishing URL characteristics. Verma and Das [8] demonstrated that fast lexical feature extraction enables competitive detection accuracy with substantially lower latency than model inference. Hybrid systems combine blacklist verification with machine learning scoring to balance speed and accuracy [2], but still rely on models requiring periodic retraining.

SafeSurf distinguishes itself from all prior work by eliminating probabilistic inference entirely. Unlike hybrid systems, it produces fully deterministic, explainable decisions at constant time — a property not demonstrated by any previously reported browser-based phishing detection system.

---

## 3. Proposed Methodology

SafeSurf prioritises sub-millisecond latency and fully reproducible decisions. The detection pipeline comprises two sequential stages: direct blacklist verification followed by structural risk scoring for domains not present in the blacklist.

### 3.1 Direct Blacklist Check

Let D denote the set of known malicious domains and U the input URL. Following normalisation (lowercasing, stripping protocol and path):

```
Uₙ = normalize(U)
```

If Uₙ ∈ D, the system immediately returns:

```
f(U) = Critical
```

The domain set D is stored as a JavaScript Set object, which provides O(1) average-case lookup complexity via hash-based indexing. This operation executes in under 0.1 ms regardless of database size. The current database contains 640,000 entries sourced from PhishTank [12], OpenPhish [13], and APWG feeds [14], updated weekly via an automated pull mechanism.

### 3.2 Structural Risk Scoring for Unknown Domains

For domains not present in D, SafeSurf computes a composite risk score R from three structural features, each normalised to the range [0, 1].

**Domain Randomness (H).** Rather than computing full Shannon entropy, SafeSurf approximates character randomness via the ratio of unique characters to domain length:

```
H = |unique_chars(domain)| / |domain|
```

Higher values of H indicate greater character diversity, which correlates with algorithmically generated domain names. For example, paypal.com yields H ≈ 0.55, whereas xj29akd83.xyz yields H ≈ 0.89.

**Subdomain Depth (S).** Phishing URLs frequently exploit deep subdomain chains to mimic legitimate services. SafeSurf counts the number of dot-delimited labels preceding the registered domain:

```
S = min(depth, 5) / 5
```

Capping at 5 prevents saturation and normalises the score. A URL such as secure.pay.login.verify.xyz (depth = 4) yields S = 0.8.

**TLD Risk Score (T).** Certain top-level domains exhibit disproportionate association with malicious activity. SafeSurf assigns predetermined risk values based on empirical threat feed analysis:

```
.xyz → 0.70,  .top → 0.80,  .gq → 0.90,  .tk → 0.85,  others → 0.20
```

The composite risk score integrates all three components via a weighted sum:

```
R = (0.4 × H) + (0.3 × S) + (0.3 × T)
```

Weights were determined empirically through 5-fold cross-validation on a development set of 2,000 labelled URLs, optimising for F1 score. Classification thresholds are defined as:

```
R < 0.4           →  Safe
0.4 ≤ R < 0.7    →  Suspicious
R ≥ 0.7           →  Critical
```

### 3.3 Detection Algorithm

The complete detection pipeline proceeds as follows:

1. Normalise the input URL
2. Perform O(1) blacklist lookup — if matched, classify as Critical and terminate
3. If not matched, compute H, S, and T
4. Calculate the composite score R
5. Assign the threat classification based on defined thresholds
6. If Suspicious or Critical, invoke the Shadow DOM warning overlay

The entire pipeline executes deterministically, guaranteeing identical output for identical input regardless of system state or prior history.

### 3.4 System Architecture

The Quad-Layer Defense Architecture of SafeSurf depicts the sequential processing stages: URL normalisation and blacklist lookup (Layer 1), structural risk analysis (Layer 2), hidden URL reconstruction from page content (Layer 3), and Shadow DOM warning injection (Layer 4).

```
┌──────────────────────────────────────────────────────────────────┐
│                   SAFESURF — QUAD-LAYER DEFENSE                  │
│                                                                  │
│  URL Input                                                       │
│     │                                                            │
│     ▼                                                            │
│  [LAYER 1] Direct Recognition — O(1) Blacklist Lookup            │
│     640,000+ verified malicious domains → JavaScript Set         │
│     Match found? ─YES─► 🔴 CRITICAL [TERMINATE]                  │
│     │ No match                                                   │
│     ▼                                                            │
│  [LAYER 2] Structural Risk Scoring                               │
│     H (randomness) + S (subdomain depth) + T (TLD risk)          │
│     R = 0.4H + 0.3S + 0.3T                                       │
│     R ≥ 0.7 ──► 🔴 CRITICAL                                      │
│     R ≥ 0.4 ──► 🟡 SUSPICIOUS                                    │
│     R  < 0.4 ──► 🟢 SAFE                                         │
│     │ Suspicious / Critical                                      │
│     ▼                                                            │
│  [LAYER 3] Content Deep Mining                                   │
│     Regex extraction + de-obfuscation of hidden URLs             │
│     Entropy analysis for DGA domain detection                    │
│     │                                                            │
│     ▼                                                            │
│  [LAYER 4] Active DOM Defense — Hologram Shield                  │
│     Shadow DOM overlay — tamper-proof, CSS-isolated              │
│     "Return to Safety" | "Proceed (Unsafe)"                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Results and Evaluation

SafeSurf was evaluated against six baseline methods across four dimensions: detection accuracy (precision, recall, F1), inference latency, memory footprint, and decision explainability. Experiments were conducted on a balanced evaluation dataset of 10,000 URLs: 5,000 confirmed phishing URLs sourced from PhishTank [12] and OpenPhish [13], and 5,000 benign URLs from the Alexa Top 1 Million list. To assess generalisation to zero-day threats, 1,000 of the phishing URLs were withheld from the blacklist, forcing the structural risk scorer to handle them as unknown domains. All latency measurements were obtained on a standard consumer laptop (Intel Core i5-1135G7, 8 GB RAM) running Google Chrome 124 with the SafeSurf extension active, averaged over 1,000 repeated URL classifications per method.

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

SafeSurf achieves a precision of 97.8% and recall of 96.4%, yielding an F1 score of 97.1%. These figures are competitive with CNN-based approaches (F1 = 94.7%) while delivering latency approximately 437× lower. Notably, SafeSurf outperforms pure blacklist-only detection (F1 = 79.6%) by a substantial margin, demonstrating that the structural risk scoring layer provides meaningful coverage of zero-day threats not present in the domain database.

The false negative rate for blacklisted domains is 0% by design — any domain present in D is unconditionally classified as Critical. For the 1,000 zero-day phishing URLs evaluated via structural scoring, SafeSurf correctly classified 89.3% as Suspicious or Critical, demonstrating effective generalisation beyond the blacklist.

### 4.2 Latency and Resource Consumption

SafeSurf achieves mean detection latency of 0.42 ms across all URL types: blacklist hits resolve in under 0.1 ms, while structural analysis of unknown domains completes in approximately 0.5 ms. In contrast, Random Forest [5] requires a mean of 68.3 ms, SVM-based methods [16] average 112.5 ms, and CNN-based systems [7] average 183.6 ms per classification — representing latency penalties of 162×, 268×, and 437× respectively.

The complete SafeSurf extension occupies approximately 15 MB of browser memory, compared to 100–500 MB for machine learning model deployments. CPU utilisation remains below 0.5% during active browsing, measured via Chrome Task Manager across a 10-minute browsing session.

### 4.3 Explainability and Maintenance

Every classification produced by SafeSurf is fully traceable to one of four explicit causes:

1. Direct blacklist match
2. High domain randomness score
3. Excessive subdomain depth
4. High-risk TLD

This transparency stands in direct contrast to machine learning classifiers, which operate as black boxes and cannot provide human-interpretable rationales for individual decisions. From an operational standpoint, maintaining SafeSurf requires only periodic blacklist database updates — a simple data synchronisation operation. Machine learning systems, by contrast, require retraining cycles, hyperparameter re-optimisation, and model validation whenever the threat landscape shifts.

### 4.4 Dashboard and Deployment

The SafeSurf browser extension dashboard provides real-time threat statistics, per-session detection metrics, and system status. The dashboard surfaces the precise risk factors triggering each warning, reinforcing decision transparency for end users. SafeSurf correctly identifies 100% of blacklisted domains in the evaluation set. The structural scorer successfully flags domains exhibiting high randomness, excessive subdomain nesting, or high-risk TLDs.

The primary limitation arises with sophisticated phishing pages that replicate the visual design of legitimate sites using domain structures with low structural risk scores — a scenario where semantic content analysis would be beneficial.

---

## 5. Discussion

The experimental results demonstrate that deterministic systems can achieve detection accuracy competitive with machine learning baselines while offering substantial advantages in latency, explainability, and operational simplicity. SafeSurf's F1 score of 97.1% exceeds all evaluated ML baselines except CNN-based approaches (F1 = 94.7%), while delivering latency approximately 437× lower — a trade-off that is unambiguously favourable for browser-based deployment where user experience is paramount.

The principal limitation of SafeSurf is its reduced efficacy against phishing pages that employ structurally innocuous domain names — for example, legitimate-looking domains registered specifically for a single short-lived campaign. In such cases, the structural risk score may not reach the Critical threshold, resulting in false negatives. This limitation is inherent to any system that does not perform page-content semantic analysis. However, such advanced attacks represent a minority of real-world phishing attempts, which predominantly exhibit detectable structural anomalies [14].

Decision transparency confers practical benefits beyond performance metrics. Users who receive a SafeSurf warning accompanied by a clear explanation (e.g., "Domain flagged: high character randomness (H = 0.87) and high-risk TLD (.xyz)") are better equipped to make informed security decisions than those confronted by an opaque ML-generated risk score. This aligns with the broader principle of explainable AI in security-critical applications.

The absence of retraining requirements eliminates a significant operational risk: model degradation over time as phishing techniques evolve. SafeSurf's performance is guaranteed to remain constant between blacklist updates, since no statistical model is involved. This property is particularly valuable in enterprise deployment contexts where model governance and auditability are required.

---

## 6. Conclusion and Future Work

This paper presented SafeSurf, a deterministic browser extension for real-time phishing detection combining O(1) hash-based blacklist lookup with structural domain risk scoring. Evaluated on 10,000 URLs against five baselines, SafeSurf achieves an F1 score of 97.1% with mean detection latency of 0.42 ms — outperforming all evaluated ML baselines on the speed-accuracy trade-off. All decisions are fully explainable and reproducible, with no inference variability, no retraining requirements, and a memory footprint of approximately 15 MB.

Directions for future work include:

1. **Hybrid architectures** that selectively invoke lightweight ML-based semantic analysis when the structural score falls in the Suspicious range
2. **DNS-layer threat scanning** to intercept malicious domains before page load
3. **Federated threat intelligence sharing** across SafeSurf user networks
4. **AI-assisted form-field analysis** to detect credential harvesting pages with benign domain structures
5. **Mobile browser integration** with platform-specific performance optimisations

SafeSurf demonstrates that deterministic approaches can provide effective, transparent, and high-performance protection against phishing — challenging the assumption that machine learning is a prerequisite for competitive modern cyber-defence.

---

## References

[1] Blum, A., Wardman, B., Solorio, T., Warner, G.: Learning to identify phishing websites. In: Proceedings of the 19th International World Wide Web Conference (WWW 2010), pp. 649–658 (2010)

[2] Cao, Y., Han, W., Le, Y.: Anti-phishing based on automated individual whitelist. In: Proceedings of the 4th ACM Workshop on Digital Identity Management, pp. 51–60 (2008)

[3] Garera, S., Provos, N., Chew, M., Rubin, A.D.: A framework for the detection and quantification of phishing attacks. In: Proceedings of the ACM Workshop on Recurring Malcode, pp. 1–8 (2007)

[4] Le, A., Markopoulou, A., Faloutsos, M.: PhishDef: URL names say it all. In: Proceedings of IEEE INFOCOM, pp. 1916–1924 (2011)

[5] Ma, J., Saul, L.K., Savage, S., Voelker, G.M.: Beyond blacklists: Learning to detect malicious web sites from suspicious URLs. In: Proceedings of the 15th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, pp. 1245–1254 (2009)

[6] Sahoo, D., Liu, C., Hoi, S.C.H.: Malicious URL detection using machine learning: A survey. arXiv:1701.07179 (2017)

[7] Sahingoz, O.K., Buber, E., Demir, O., Diri, B.: Machine learning based phishing detection from URLs. Expert Systems with Applications 117, 345–357 (2019)

[8] Verma, R., Das, A.: What's in a URL: Fast feature extraction and malicious URL detection. In: Proceedings of the 3rd ACM International Workshop on Security and Privacy Analytics, pp. 55–63 (2017)

[9] Whittaker, C., Ryner, B., Nazif, M.: Large-scale automatic classification of phishing pages. In: Proceedings of the Network and Distributed System Security Symposium (NDSS) (2010)

[10] Zhang, Y., Egelman, S., Cranor, L., Hong, J.: Phinding phish: Evaluating anti-phishing tools. In: Proceedings of the Network and Distributed System Security Symposium (NDSS) (2007)

[11] Google: Safe Browsing API Documentation. https://developers.google.com/safe-browsing (2025)

[12] PhishTank: Community Phishing Data Repository. https://www.phishtank.com (2025)

[13] OpenPhish: Phishing Intelligence Feed. https://openphish.com (2025)

[14] Anti-Phishing Working Group (APWG): Phishing Activity Trends Report, Q4 2023. https://apwg.org (2023)

[15] Almomani, A., Gupta, B.B., Atawneh, S., Meulenberg, A., Almomani, E.: A survey of phishing email filtering techniques. IEEE Communications Surveys & Tutorials 15(4), 2070–2090 (2013)

[16] Jain, A.K., Gupta, B.B.: A novel approach to protect against phishing attacks at client side using auto-updated white-list. EURASIP Journal on Information Security 2016(1), 1–11 (2016)

[17] Khonji, M., Iraqi, Y., Jones, A.: Phishing detection: A literature survey. IEEE Communications Surveys & Tutorials 15(4), 2091–2121 (2013)

[18] Mohammad, R.M., Thabtah, F., McCluskey, L.: Predicting phishing websites based on self-structuring neural network. Neural Computing and Applications 25(2), 443–458 (2014)
