// Vercel serverless function: POST /api/analyze
// The Gemini key lives ONLY in the Vercel environment variable GEMINI_API_KEY.
//
// Two modes, chosen by the "mode" field in the request body:
//   (default)       -> audit a new hazard photo
//   "verify_fix"    -> check a photo showing a reported hazard has been repaired

const MODELS = [
  process.env.GEMINI_MODEL, // optional override set in Vercel
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
].filter(Boolean);

const AUDIT_PROMPT = `
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

function verifyPrompt(hazardType, description, hasBefore) {
  return `
You are verifying a municipal repair for the City of San Diego.
A resident originally reported this hazard: "${hazardType}" - ${description}

${hasBefore
  ? 'You are given two images. The FIRST is the original BEFORE photo of the hazard. The SECOND is the new AFTER photo submitted as proof of repair.'
  : 'You are given one image: the AFTER photo submitted as proof that the hazard was repaired.'}

Decide whether the AFTER photo proves the reported hazard has been FULLY repaired, removed, or cleaned up.

Set is_fixed to true ONLY if ALL of these hold:
- The AFTER photo shows a real outdoor public-infrastructure scene (street, sidewalk, curb, light, pipe, etc.).
${hasBefore ? '- It appears to show the SAME spot as the BEFORE photo (same surroundings, angle may differ).\n' : ''}- The reported hazard is clearly no longer present.

Set is_fixed to false if the hazard is still visible, only partly repaired, the photo is unrelated
(selfie, meme, pet, indoor, screenshot), it seems to be a different location, or you cannot tell.

Respond with ONLY this JSON object:
{
  "is_fixed": boolean,
  "reason": "one or two plain sentences explaining your decision"
}
`;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Calls Gemini, falling back through MODELS if a model name has been retired.
async function callGemini(apiKey, parts) {
  const payload = JSON.stringify({
    contents: [{ parts }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
  });

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
      if (response.status === 404) continue; // retired model -> try next
      const err = new Error(lastError);
      err.status = response.status || 400;
      throw err;
    }

    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const reason = json.promptFeedback?.blockReason || 'empty response';
      const err = new Error(`Gemini returned no result (${reason}).`);
      err.status = 502;
      throw err;
    }
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  }

  const err = new Error(lastError);
  err.status = 502;
  throw err;
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
    body = body || {};

    const { base64Image, mimeType, mode } = body;
    if (!base64Image) return res.status(400).json({ error: 'No image data provided.' });

    const imagePart = (data, type) => ({ inline_data: { mime_type: type || 'image/jpeg', data } });

    if (mode === 'verify_fix') {
      const hazardType = String(body.hazardType || 'infrastructure hazard').slice(0, 120);
      const description = String(body.description || '').slice(0, 300);
      const hasBefore = Boolean(body.beforeBase64);

      const parts = [{ text: verifyPrompt(hazardType, description, hasBefore) }];
      if (hasBefore) parts.push(imagePart(body.beforeBase64, body.beforeMimeType));
      parts.push(imagePart(base64Image, mimeType));

      const result = await callGemini(apiKey, parts);
      return res.status(200).json({
        is_fixed: result.is_fixed === true,
        reason: String(result.reason || ''),
      });
    }

    const result = await callGemini(apiKey, [{ text: AUDIT_PROMPT }, imagePart(base64Image, mimeType)]);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  }
};
