# FixMySanDiego

AI-powered civic infrastructure issue tagger for San Diego. Upload a photo of a hazard and Google Gemini checks that it is real public infrastructure, scores urgency, estimates repair cost and time, and plots it on a map. Reports within 30 meters of each other are merged.

## Project structure

```
index.html        # frontend (Leaflet map + report form)
api/analyze.js    # Vercel serverless function that calls Gemini
package.json
.gitignore
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import it at vercel.com.
3. In Project Settings > Environment Variables, add `GEMINI_API_KEY` with your key from https://aistudio.google.com/apikey. Optionally add `GEMINI_MODEL` to pick a specific model.
4. Redeploy, then open the `*.vercel.app` URL.

## Security

**Never write your API key in any file in this repo (including this README).** Google scans public GitHub repos and disables any key it finds. The key belongs only in Vercel's environment variables.
