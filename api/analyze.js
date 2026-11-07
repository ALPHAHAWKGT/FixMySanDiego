// Vercel serverless function: POST /api/analyze
// The Gemini key lives ONLY in the Vercel environment variable GEMINI_API_KEY.

const MODELS = [
  process.env.GEMINI_MODEL, // optional override set in Vercel
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
].filter(Boolean);

const PROMPT = `
You are an automated civic public works auditor for San Diego. Analyze the attached image.

FIRST, decide whether it shows legitimate municipal infrastructure or a public safety hazard
(e.g. potholes, broken sidewalks, exposed wiring, burst water pipes, downed trees,
damaged street lights, graffiti, illegal dumping).

If the image is a selfie, meme, pet, animal, indoor object, text screenshot, or any
non-infrastructure item, it is INVALID.

Respond with ONLY this JSON object:
{
  "is_valid_hazard": boolean,
  "rejection_reason": "string explaining why it was rejected, or null if valid",
  "hazard_type": "string (e.g. Broken Sidewalk, Burst Pipe, Damaged Streetlight, Pothole)",
  "urgency_score": number between 1 and 10,
  "estimated_cost_usd": number,
  "estimated_repair_hours": number,
  "description": "brief summary of the safety risk"
}
`;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not set. Add it in Vercel > Settings > Environment Variables, then redeploy.',
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    const { base64Image, mimeType } = body || {};
    if (!base64Image) return res.status(400).json({ error: 'No image data provided.' });

    const payload = JSON.stringify({
      contents: [{
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: mimeType || 'image/jpeg', data: base64Image } },
        ],
      }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
    });

    let data = null;
    let lastError = 'Unknown error';

    for (const model of MODELS) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: payload,
        }
      );
      const json = await response.json();

      if (json.error) {
        lastError = `${model}: ${json.error.message}`;
        // Model name retired / not found -> try the next one. Anything else -> stop.
        if (response.status === 404) continue;
        return res.status(response.status || 400).json({ error: lastError });
      }
      data = json;
      break;
    }

    if (!data) return res.status(502).json({ error: lastError });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const reason = data.promptFeedback?.blockReason || 'empty response';
      return res.status(502).json({ error: `Gemini returned no result (${reason}).` });
    }

    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
