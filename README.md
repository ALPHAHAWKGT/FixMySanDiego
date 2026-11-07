# FixMySanDiego

AI-powered civic infrastructure issue tagger for San Diego. Upload a photo of a hazard and Google Gemini checks that it is real public infrastructure, scores urgency, estimates repair cost and time, and plots it on a map. Reports within 30 meters of each other are merged.

## Problem

When a UCSD student or San Diego resident trips over a raised sidewalk slab or spots a pothole, reporting it is harder than it should be:

- **Where do I report it?** UCSD Facilities' *Report It* covers campus property; the City's *Get It Done* covers public streets and sidewalks. People rarely know which applies.
- **What do I write?** Reports like "hole in road" or "broken sidewalk" give crews little to work with, so someone has to go and look before the job can be scheduled.
- **Where exactly is it?** Phone GPS shows where *you* are, not necessarily where the defect is.

The City's own Get It Done sidewalk page estimates about **6 days for temporary mitigation** (such as ramping) and **8+ years for permanent repairs** ([source](https://getitdone.sandiego.gov/TSWNewReport?type=Sidewalk), checked Nov 7, 2026). Clear, well-located reports help that queue get triaged.


## How It Works

1. **Report:** A resident uploads a photo of a hazard and its location (GPS or typed coordinates). The browser shrinks the photo and sends it to a Vercel serverless function at `/api/analyze`.
2. **AI audit:** The function sends the photo to Google Gemini, which decides whether it shows real public infrastructure. Selfies, pets, memes, and other non-hazards are rejected. Valid photos come back as structured JSON with the hazard type, urgency score (1-10), estimated repair cost, repair hours, and a short description.
3. **Map and feed:** Valid reports appear as color-coded pins on a Leaflet map and in a searchable feed. If a new report matches an existing one of the same type within 30 meters, the two are merged and the upvote count goes up instead of creating a duplicate.
4. **Resolve:** Anyone can click **Mark Resolved** and upload a photo of the repaired spot. Gemini compares it against the original photo and the report description. If it confirms the hazard is gone, the report is removed from the map, feed, and stats. If not, the report stays.
5. **Dispatch output:** The dispatch window shows all current reports as a JSON list that a city system could use.

The Gemini API key is stored only in Vercel's environment variables and is used only by the serverless function, so it is never exposed in the browser.


```
index.html        # frontend (Leaflet map + report form)
api/analyze.js    # Vercel serverless function that calls Gemini
package.json
.gitignore
```
