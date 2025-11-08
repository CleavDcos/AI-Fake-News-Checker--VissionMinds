# Feedback API Endpoints Documentation

This document describes all available API endpoints for feedback management in the FakeCheck backend.

**Base URL:** `/api/feedback`

**Authentication:** All endpoints require authentication (JWT token in Authorization header)

---

## 1. Submit Feedback

Submit feedback (upvote/downvote) for a prediction. If feedback already exists from the user, it will be updated.

**Endpoint:** `POST /api/feedback`

**Authentication:** Required

**Request Body:**
```json
{
  "predictionId": "prediction_id (required)",
  "vote": "upvote" | "downvote (required)",
  "comment": "Optional comment text (max 500 characters)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "feedback_id",
    "predictionId": "prediction_id",
    "userId": "user_id",
    "vote": "upvote",
    "comment": "This prediction seems accurate",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (200 OK) - When updating existing feedback:**
```json
{
  "success": true,
  "message": "Feedback updated",
  "data": {
    "_id": "feedback_id",
    "predictionId": "prediction_id",
    "userId": "user_id",
    "vote": "downvote",
    "comment": "Updated comment",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or validation error
- `404 Not Found` - Prediction not found
- `401 Unauthorized` - Missing or invalid token

**Validation Rules:**
- `predictionId` must be a valid MongoDB ObjectId
- `vote` must be either "upvote" or "downvote"
- `comment` is optional but cannot exceed 500 characters

---

## 2. Get Feedback by Prediction

Retrieve all feedback for a specific prediction with statistics.

**Endpoint:** `GET /api/feedback/prediction/:predictionId`

**Authentication:** Required

**URL Parameters:**
- `predictionId` - Prediction ID

**Response (200 OK):**
```json
{
  "success": true,
  "count": 15,
  "statistics": {
    "total": 15,
    "upvotes": 10,
    "downvotes": 5
  },
  "data": [
    {
      "_id": "feedback_id",
      "predictionId": "prediction_id",
      "userId": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "vote": "upvote",
      "comment": "Great analysis!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "feedback_id_2",
      "predictionId": "prediction_id",
      "userId": {
        "_id": "user_id_2",
        "name": "Another User",
        "email": "another@example.com"
      },
      "vote": "downvote",
      "comment": "I disagree with this assessment",
      "createdAt": "2024-01-01T01:00:00.000Z",
      "updatedAt": "2024-01-01T01:00:00.000Z"
    }
  ]
}
```

**Response when no feedback exists:**
```json
{
  "success": true,
  "count": 0,
  "statistics": {
    "total": 0,
    "upvotes": 0,
    "downvotes": 0
  },
  "data": []
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

**Notes:**
- Feedbacks are sorted by creation date (newest first)
- Statistics include total count, upvotes, and downvotes
- User information is populated for each feedback

---

## 3. Get User's Feedback

Retrieve all feedback submitted by the authenticated user.

**Endpoint:** `GET /api/feedback/my-feedback`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "feedback_id",
      "predictionId": {
        "_id": "prediction_id",
        "articleId": "article_id",
        "predictedLabel": "Likely True",
        "confidenceScore": 0.85,
        "explanation": "Analysis explanation...",
        "evidenceLinks": [],
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "userId": "user_id",
      "vote": "upvote",
      "comment": "I agree with this prediction",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Response when user has no feedback:**
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
- Returns all feedbacks submitted by the authenticated user
- Feedbacks are sorted by creation date (newest first)
- Prediction information is populated for each feedback

---

## 4. Delete Feedback

Delete a feedback entry. Only the feedback owner or a moderator can delete.

**Endpoint:** `DELETE /api/feedback/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Feedback ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Feedback deleted successfully"
}
```

**Error Responses:**
- `403 Forbidden` - Not authorized to delete this feedback
- `404 Not Found` - Feedback not found
- `401 Unauthorized` - Missing or invalid token

**Authorization Rules:**
- Users can only delete their own feedback
- Moderators can delete any feedback

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

### Feedback Object
```json
{
  "_id": "feedback_id",
  "predictionId": "prediction_id (ObjectId reference)",
  "userId": "user_id (ObjectId reference)",
  "vote": "upvote" | "downvote",
  "comment": "Optional comment string (max 500 chars)",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

## Notes

- **One feedback per user per prediction:** Each user can only submit one feedback per prediction. If they submit again, the existing feedback is updated.
- **Vote types:** Only "upvote" and "downvote" are allowed
- **Comment length:** Comments are limited to 500 characters
- **Timestamps:** All timestamps are in ISO 8601 format
- **User information:** User details are populated in responses where applicable
- **Prediction information:** Prediction details are populated when fetching user's feedback
- **Statistics:** Feedback statistics include total count, upvotes, and downvotes
- **Sorting:** Feedbacks are sorted by creation date (newest first)
- **Authorization:** Users can only delete their own feedback unless they are moderators

## Use Cases

1. **Vote on Prediction Accuracy:** Users can upvote or downvote predictions to indicate agreement or disagreement
2. **Provide Additional Context:** Users can add comments with evidence or explanations
3. **Track Community Consensus:** Statistics show overall community sentiment about a prediction
4. **Manage Feedback:** Users can update or delete their own feedback

## Example Workflow

1. User views a prediction for an article
2. User submits feedback with upvote/downvote and optional comment
3. System updates or creates feedback (one per user per prediction)
4. Other users can view all feedbacks and statistics
5. Users can manage their own feedback (update/delete)

