# 🌊 FixMySanDiego — AI-Powered Civic Infrastructure Audit Engine

> Transforming crowdsourced municipal hazard reports into structured, prioritized public works data using Google Gemini 3.8 Flash Vision AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![AI Model](https://img.shields.io/badge/AI-Gemini%203.8%20Flash-orange)
![Deployment](https://img.shields.io/badge/Deploy-Vercel-black)
![Region](https://img.shields.io/badge/Built%20For-San%20Diego-0284c7)

---

## 📌 Overview

**FixMySanDiego** simplifies public hazard reporting to a single photo upload. Powered by **Google Gemini AI**, the application analyzes images, flags invalid/troll submissions, estimates repair backlogs, and outputs structured Open311-compatible dispatch records.

## 🛠 Features

* 📸 **Photo Audit & Gatekeeper:** AI auto-checks for valid public infrastructure hazards.
* 📍 **Geospatial Deduplication:** Automatically merges reports within a 30-meter radius.
* 🗺️ **Interactive Leaflet Dashboard:** Urgent pin clustering and live repair backlog tracking.
* 🔒 **Secure Vercel Backend:** API key executed strictly via serverless functions.

---

## 🚀 Deployment on Vercel

1. Extract this ZIP archive and push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. In your Vercel Project Settings under **Environment Variables**, add:
   * **Key:** `GEMINI_API_KEY`
   * **Value:** `AQ.Ab8RN6J2-vtxFZdnLMPD1h6Kp9iqEIcNRswOPXz6kNK1L-lWzQ`
4. Deploy! Vercel will host the frontend and serve `/api/analyze` automatically.
