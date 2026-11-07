export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is missing on Vercel environment variables.' });
  }

  try {
    const { base64Image, mimeType } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: 'No image data provided.' });
    }

    const prompt = `
      Analyze this image. You are an automated civic public works auditor for San Diego.
      
      FIRST, determine if this image contains legitimate municipal infrastructure or public safety hazards 
      (e.g., potholes, broken sidewalks, exposed wiring, burst water pipes, downed trees, damaged street lights, graffiti). 

      If the image is a selfie, meme, pet, animal, indoor object, text screenshot, or non-infrastructure item, 
      you MUST classify it as INVALID.

      Respond strictly in valid JSON with no markdown formatting:
      {
        "is_valid_hazard": boolean,
        "rejection_reason": "string (e.g. 'Image appears to be a pet/meme and does not contain public infrastructure' if false, else null)",
        "hazard_type": "string (e.g. Broken Sidewalk, Burst Pipe, Damaged Streetlight)",
        "urgency_score": number (1 to 10),
        "estimated_cost_usd": number,
        "estimated_repair_hours": number,
        "description": "string (brief summary of safety risk)"
      }
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType || "image/jpeg", data: base64Image } }
          ]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const rawText = data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(rawText);

    return res.status(200).json(parsedData);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
