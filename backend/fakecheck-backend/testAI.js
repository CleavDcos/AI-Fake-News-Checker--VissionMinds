// testAI.js
const aiService = require('./services/aiService');

(async () => {
  const testArticle = {
    title: "Breaking News: AI Revolutionizes Tech Industry",
    content: "Artificial Intelligence (AI) is transforming the technology sector...",
    url: "https://example.com/ai-news",
    domain: "example.com",
    sourceReliabilityScore: 0.5
  };

  const result = await aiService.analyzeArticle(testArticle);
  console.log(result);
})();
