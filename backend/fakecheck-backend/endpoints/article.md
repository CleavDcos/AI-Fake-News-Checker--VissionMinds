# Article API Endpoints Documentation

This document describes all available API endpoints for article management in the FakeCheck backend.

**Base URL:** `/api/articles`

**Authentication:** All endpoints require authentication (JWT token in Authorization header)

---

## 1. Submit Article

Submit a new article for verification.

**Endpoint:** `POST /api/articles`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Article Title (optional)",
  "content": "Article content text (required, min 50 characters)",
  "url": "https://example.com/article (optional)",
  "relatedArticles": ["https://related1.com", "https://related2.com"] // optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Article submitted successfully",
  "data": {
    "_id": "article_id",
    "title": "Article Title",
    "content": "Article content text",
    "url": "https://example.com/article",
    "domain": "example.com",
    "sourceReliabilityScore": 0.5,
    "relatedArticles": [],
    "submittedBy": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or content too short
- `401 Unauthorized` - Missing or invalid token

---

## 2. Get All Articles

Retrieve all articles with pagination and filtering options.

**Endpoint:** `GET /api/articles`

**Authentication:** Required

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `search` (optional) - Search term for title/content
- `domain` (optional) - Filter by domain name
- `minReliability` (optional) - Minimum source reliability score (0-1)
- `maxReliability` (optional) - Maximum source reliability score (0-1)
- `userId` (optional) - Filter by user ID (moderators only)

**Example:** `GET /api/articles?page=1&limit=10&search=fake&minReliability=0.7`

**Response (200 OK):**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  },
  "count": 10,
  "data": [
    {
      "_id": "article_id",
      "title": "Article Title",
      "content": "Article content...",
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
    }
  ]
}
```

---

## 3. Get Single Article

Retrieve a single article with its prediction and feedback.

**Endpoint:** `GET /api/articles/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Article ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "article": {
      "_id": "article_id",
      "title": "Article Title",
      "content": "Article content...",
      "url": "https://example.com/article",
      "domain": "example.com",
      "sourceReliabilityScore": 0.8,
      "relatedArticles": [],
      "submittedBy": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "role": "user"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "prediction": {
      "_id": "prediction_id",
      "articleId": "article_id",
      "predictedLabel": "Likely True",
      "confidenceScore": 0.85,
      "explanation": "Analysis explanation...",
      "evidenceLinks": [],
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "feedbacks": [
      {
        "_id": "feedback_id",
        "predictionId": "prediction_id",
        "userId": {
          "_id": "user_id",
          "name": "User Name",
          "email": "user@example.com"
        },
        "vote": "upvote",
        "comment": "Helpful comment",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "feedbackStats": {
      "total": 10,
      "upvotes": 7,
      "downvotes": 3
    }
  }
}
```

**Error Responses:**
- `404 Not Found` - Article not found
- `401 Unauthorized` - Missing or invalid token

---

## 4. Get User's Articles

Retrieve all articles submitted by the authenticated user.

**Endpoint:** `GET /api/articles/my-articles`

**Authentication:** Required

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `search` (optional) - Search term for title/content

**Response (200 OK):**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "count": 10,
  "data": [
    {
      "_id": "article_id",
      "title": "Article Title",
      "content": "Article content...",
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
    }
  ]
}
```

---

## 5. Update Article

Update an existing article. Only the article owner or a moderator can update.

**Endpoint:** `PUT /api/articles/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Article ID

**Request Body:**
```json
{
  "title": "Updated Title (optional)",
  "content": "Updated content (optional, min 50 characters)",
  "url": "https://newurl.com/article (optional)",
  "relatedArticles": ["https://related1.com"] // optional
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Article updated successfully",
  "data": {
    "_id": "article_id",
    "title": "Updated Title",
    "content": "Updated content",
    "url": "https://newurl.com/article",
    "domain": "newurl.com",
    "sourceReliabilityScore": 0.7,
    "relatedArticles": ["https://related1.com"],
    "submittedBy": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or content too short
- `403 Forbidden` - Not authorized to update this article
- `404 Not Found` - Article not found
- `401 Unauthorized` - Missing or invalid token

---

## 6. Delete Article

Delete an article. Only the article owner or a moderator can delete. This will also delete associated predictions and feedbacks.

**Endpoint:** `DELETE /api/articles/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Article ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

**Error Responses:**
- `403 Forbidden` - Not authorized to delete this article
- `404 Not Found` - Article not found
- `401 Unauthorized` - Missing or invalid token

---

## 7. Extract Domain from URL

Extract domain from a URL and get source reliability information.

**Endpoint:** `POST /api/articles/extract-domain`

**Authentication:** Required

**Request Body:**
```json
{
  "url": "https://www.example.com/article"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "domain": "example.com",
    "sourceReliabilityScore": 0.9,
    "category": "reliable",
    "verified": true
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid URL format or missing URL
- `401 Unauthorized` - Missing or invalid token

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

## Notes

- All timestamps are in ISO 8601 format
- Content must be at least 50 characters
- Source reliability scores range from 0.0 to 1.0
- Domain is automatically extracted from URL if provided
- Only article owners or moderators can update/delete articles
- Deleting an article also deletes associated predictions and feedbacks

