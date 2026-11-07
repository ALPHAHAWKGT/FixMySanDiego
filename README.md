# FixMySanDiego

AI-powered civic infrastructure issue tagger for San Diego. Upload a photo of a hazard and Google Gemini checks that it is real public infrastructure, scores urgency, estimates repair cost and time, and plots it on a map. Reports within 30 meters of each other are merged.

## Problem

When a UCSD student or San Diego resident trips over a raised sidewalk slab or spots a pothole, reporting it is harder than it should be:

- **Where do I report it?** UCSD Facilities' *Report It* covers campus property; the City's *Get It Done* covers public streets and sidewalks. People rarely know which applies.
- **What do I write?** Reports like "hole in road" or "broken sidewalk" give crews little to work with, so someone has to go and look before the job can be scheduled.
- **Where exactly is it?** Phone GPS shows where *you* are, not necessarily where the defect is.

The City's own Get It Done sidewalk page estimates about **6 days for temporary mitigation** (such as ramping) and **8+ years for permanent repairs** ([source](https://getitdone.sandiego.gov/TSWNewReport?type=Sidewalk), checked Nov 7, 2026). Clear, well-located reports help that queue get triaged.

```
index.html        # frontend (Leaflet map + report form)
api/analyze.js    # Vercel serverless function that calls Gemini
package.json
.gitignore
```
