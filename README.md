# FixMySanDiego

AI-powered civic infrastructure issue tagger for San Diego. Upload a photo of a hazard and Google Gemini checks that it is real public infrastructure, scores urgency, estimates repair cost and time, and plots it on a map. Reports within 30 meters of each other are merged.

## Project structure

```
index.html        # frontend (Leaflet map + report form)
api/analyze.js    # Vercel serverless function that calls Gemini
package.json
.gitignore
```
