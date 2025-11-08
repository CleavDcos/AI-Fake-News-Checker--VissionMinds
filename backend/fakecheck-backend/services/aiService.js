const { OpenAI } = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const aiService = {
  analyzeArticle: async (articleData) => {
    try {
      const prompt = `
      You are a fact-checking AI. Analyze the following content and return JSON exactly in this format:
      {
        "label": "Likely True / Uncertain / Likely False",
        "confidence": 0-1,
        "explanation": "Provide a brief reasoning behind the label",
        "sentiment": "positive / negative / neutral",
        "evidenceLinks": ["optional URLs used as proof"]
      }
      Content: "${articleData.content}"
      `;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0
      });

      const outputText = response.choices[0].message.content;

      // Parse JSON from AI response
      let result;
      try { result = JSON.parse(outputText); }
      catch (e) { 
        console.error("Failed to parse AI JSON output:", outputText);
        result = { label: "Uncertain", confidence: 0.5, explanation: "Parsing error", evidenceLinks: [] };
      }

      return result;

    } catch (error) {
      console.error("AI Service Error:", error.message);

      // Fallback to previous mock analysis
      return aiService.mockAnalysis(articleData);
    }
  },

  mockAnalysis: (articleData) => {
    // Keep your current mockAnalysis as fallback
    const content = (articleData.content || '').toLowerCase();
    const title = (articleData.title || '').toLowerCase();
    const combinedText = title + ' ' + content;

    const suspiciousWords = ['breaking', 'shocking', 'you won\'t believe', 'doctors hate', 'click here'];
    const suspiciousCount = suspiciousWords.filter(word => combinedText.includes(word)).length;

    let label = 'Uncertain';
    let confidence = 0.5;

    if (articleData.sourceReliabilityScore > 0.7 && suspiciousCount < 2) {
      label = 'Likely True';
      confidence = 0.75;
    } else if (articleData.sourceReliabilityScore < 0.4 || suspiciousCount > 2) {
      label = 'Likely False';
      confidence = 0.7;
    }

    const explanations = {
      'Likely True': 'The article comes from a reliable source and contains factual information with minimal suspicious language.',
      'Likely False': 'The article shows signs of misinformation, including suspicious language patterns and/or unreliable source.',
      'Uncertain': 'Unable to determine with high confidence. More context or verification needed.'
    };

    return {
      label,
      confidence,
      explanation: explanations[label],
      evidenceLinks: []
    };
  }
};

module.exports = aiService;
