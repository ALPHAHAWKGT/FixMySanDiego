# 🌊 FixMySanDiego — AI-Powered Civic Infrastructure Audit Engine

> Transforming crowdsourced municipal hazard reports into structured, prioritized public works data using Google Gemini 1.5 Flash Vision AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![AI Model](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-orange)
![Region](https://img.shields.io/badge/Built%20For-San%20Diego-0284c7)
![Status](https://img.shields.io/badge/Status-Hackathon%20MVP-emerald)

---

## 📌 Problem

San Diego faces a multi-billion dollar municipal infrastructure backlog (damaged sidewalks, degraded curbs, unmanaged street lighting, potholes, and water main bursts). The city's current 311 reporting tools require citizens to complete tedious multi-step manual forms, often yielding vague descriptions like *"hole in road"* that force public works crews to waste time conducting manual site triage.

## 💡 Solution

**FixMySanDiego** simplifies reporting down to a single photograph. Powered by **Google Gemini 1.5 Flash Vision**, the platform automatically extracts visual parameters in under two seconds to generate:

1. **Structured Hazard Classification** (e.g., *Burst Water Pipe*, *ADA Sidewalk Obstruction*)
2. **Urgency Severity Rating (1–10)** (Distinguishes immediate public safety threats like active flooding from cosmetic repairs)
3. **Estimated Repair Cost ($ USD)**
4. **Estimated Labor Hours**
5. **Actionable Civic Dispatch Recommendations**

All reports are instantly geotagged and rendered on an interactive map featuring real-time community upvoting to dynamically prioritize neighborhood backlogs.

---

## 🛠 Features

* 📸 **Direct Camera & File Capture:** Responsive mobile interface accessing native phone camera APIs.
* 🧠 **Gemini 1.5 Flash AI Vision Integration:** Live client-side or backend structured JSON parsing.
* ⚡ **Zero-Failure Demo Engine:** Built-in Quick Presets for instant presentation testing even without an API key.
* 🗺️ **Interactive Geospatial Dashboard:** Color-coded urgency pin mapping using Leaflet.js and dark-mode tile rendering.
* 📊 **Live Community Backlog Analytics:** Dynamic calculations for total estimated repair backlog costs and critical hazard counts.
* 🔄 **Open311 / City Dispatch Export:** Formatted JSON payload generator for direct integration into San Diego municipal 311 backends.

---

## 🚀 Quick Start

### 1. Clone & Run Locally
Because the application is fully encapsulated, no complex build process is required for the MVP:

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/fix-my-san-diego.git

# Navigate to the project directory
cd fix-my-san-diego

# Open in browser directly or serve via local server
npx serve .
```

### 2. Enter Gemini API Key (Optional)
* Open the app in your browser.
* Click **"Report Hazard"**.
* Expand the **Gemini 1.5 Flash API Key** tab to input your key.
* *(Note: If no key is provided, the platform automatically utilizes its Smart AI Simulation Engine for seamless demoing).*

---

## 📂 Repository Structure

```
fix-my-san-diego/
├── index.html                      # Complete Single-File PWA Web Application
├── README.md                       # Product documentation and setup guide
├── .gitignore                      # Git exclusion patterns
└── package.json                    # Package metadata & scripts
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.