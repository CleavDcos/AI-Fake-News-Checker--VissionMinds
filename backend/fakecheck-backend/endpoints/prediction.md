# Prediction API Endpoints Documentation

This document describes all available API endpoints for prediction management in the FakeCheck backend.

**Base URL:** `/api/predictions`

**Authentication:** All endpoints require authentication (JWT token in Authorization header)

---

## 1. Generate Prediction

Generate an AI-powered prediction for an article. If a prediction already exists for the article, it will be returned instead of creating a new one.

**Endpoint:** `POST /api/predictions`

**Authentication:** Required

**Request Body:**
```json
{
  "articleId": "article_id (required)"
}
```

**Response (201 Created) - New prediction:**
```json
{
  "success": true,
  "data": {
    "_id": "prediction_id",
    "articleId": "article_id",
    "predictedLabel": "Likely True",
    "confidenceScore": 0.85,
    "explanation": "The article comes from a reliable source and contains factual information with minimal suspicious language.",
    "evidenceLinks": [
      "https://factcheck.org/article1",
      "https://snopes.com/article1"
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (200 OK) - Existing prediction:**
```json
{
  "success": true,
  "message": "Prediction already exists",
  "data": {
    "_id": "prediction_id",
    "articleId": "article_id",
    "predictedLabel": "Likely True",
    "confidenceScore": 0.85,
    "explanation": "Previous analysis explanation...",
    "evidenceLinks": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid article ID or missing articleId
- `404 Not Found` - Article not found
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - AI service error (falls back to mock analysis)

**Notes:**
- One prediction per article (unique constraint)
- Prediction is automatically added to the article submitter's history
- If AI service fails, system falls back to mock analysis
- Prediction labels: "Likely True", "Uncertain", or "Likely False"
- Confidence score ranges from 0.0 to 1.0

---

## 2. Get All Predictions

Retrieve all predictions with pagination.

**Endpoint:** `GET /api/predictions`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "prediction_id",
      "articleId": {
        "_id": "article_id",
        "title": "Article Title",
        "content": "Article content...",
        "url": "https://example.com/article",
        "domain": "example.com",
        "sourceReliabilityScore": 0.8,
        "relatedArticles": [],
        "submittedBy": "user_id",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "predictedLabel": "Likely True",
      "confidenceScore": 0.85,
      "explanation": "Analysis explanation...",
      "evidenceLinks": [
        "https://factcheck.org/article1"
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Response when no predictions exist:**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

**Notes:**
- Predictions are sorted by creation date (newest first)
- Article information is populated for each prediction
- Returns all predictions in the system

---

## 3. Get Single Prediction

Retrieve a single prediction by its ID with full article details.

**Endpoint:** `GET /api/predictions/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Prediction ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "prediction_id",
    "articleId": {
      "_id": "article_id",
      "title": "Article Title",
      "content": "Article content text...",
      "url": "https://example.com/article",
      "domain": "example.com",
      "sourceReliabilityScore": 0.8,
      "relatedArticles": [],
      "submittedBy": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "predictedLabel": "Likely True",
    "confidenceScore": 0.85,
    "explanation": "The article comes from a reliable source and contains factual information with minimal suspicious language.",
    "evidenceLinks": [
      "https://factcheck.org/article1",
      "https://snopes.com/article1"
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Prediction not found
- `401 Unauthorized` - Missing or invalid token

---

## 4. Get Prediction by Article

Retrieve the prediction for a specific article.

**Endpoint:** `GET /api/predictions/article/:articleId`

**Authentication:** Required

**URL Parameters:**
- `articleId` - Article ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "prediction_id",
    "articleId": {
      "_id": "article_id",
      "title": "Article Title",
      "content": "Article content text...",
      "url": "https://example.com/article",
      "domain": "example.com",
      "sourceReliabilityScore": 0.8,
      "relatedArticles": [],
      "submittedBy": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "predictedLabel": "Likely True",
    "confidenceScore": 0.85,
    "explanation": "The article comes from a reliable source and contains factual information with minimal suspicious language.",
    "evidenceLinks": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Prediction not found for this article
- `401 Unauthorized` - Missing or invalid token

**Notes:**
- Useful when you have an article ID and want to check if it has a prediction
- Returns 404 if no prediction exists for the article

---

## Authentication

All endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message description"
}
```

## Data Models

### Prediction Object
```json
{
  "_id": "prediction_id",
  "articleId": "article_id (ObjectId reference, unique)",
  "predictedLabel": "Likely True" | "Uncertain" | "Likely False",
  "confidenceScore": 0.0-1.0,
  "explanation": "String explanation from AI model",
  "evidenceLinks": ["url1", "url2"],
  "createdAt": "ISO 8601 timestamp"
}
```

### Prediction Labels

- **"Likely True"** - The article appears to be factual and from a reliable source
- **"Uncertain"** - Unable to determine with high confidence; more context needed
- **"Likely False"** - The article shows signs of misinformation or unreliable source

### Confidence Score

- Range: 0.0 to 1.0
- Higher scores indicate higher confidence in the prediction
- 0.0-0.4: Low confidence
- 0.4-0.7: Medium confidence
- 0.7-1.0: High confidence

## AI Service Integration

The prediction generation uses an AI service that:

1. Analyzes article content, title, URL, and domain
2. Checks source reliability score
3. Returns prediction label, confidence score, explanation, and evidence links

**Current Implementation:**
- Uses mock analysis for development/testing
- Can be configured to use external AI API via `AI_API_URL` in `.env`
- Falls back to mock analysis if AI service fails

**To integrate with your AI model:**
1. Set `AI_API_URL` in `.env` file
2. Configure `AI_API_KEY` if required
3. Update `services/aiService.js` to match your API response format

## Notes

- **One prediction per article:** Each article can only have one prediction (unique constraint)
- **Automatic history tracking:** When a prediction is generated, it's added to the article submitter's history
- **AI service fallback:** If the AI service fails, the system uses mock analysis
- **Article population:** Article details are populated in prediction responses
- **User information:** User details are populated when fetching predictions
- **Timestamps:** All timestamps are in ISO 8601 format
- **Evidence links:** Optional array of URLs supporting or contradicting the prediction

## Use Cases

1. **Verify Article:** Submit an article and generate a prediction to verify its authenticity
2. **Check Existing Predictions:** Retrieve predictions for articles that have already been analyzed
3. **View Prediction Details:** Get detailed prediction information including explanation and evidence
4. **Track Analysis History:** View all predictions in the system

## Example Workflow

1. User submits an article via `/api/articles`
2. User requests prediction generation via `POST /api/predictions` with article ID
3. System analyzes article using AI service
4. Prediction is created and stored
5. User can retrieve prediction via `GET /api/predictions/article/:articleId`
6. Other users can view the prediction and provide feedback

## Integration with Other Endpoints

- **Articles:** Predictions are linked to articles via `articleId`
- **Feedback:** Users can provide feedback on predictions via `/api/feedback`
- **User History:** Predictions are tracked in user's history array

