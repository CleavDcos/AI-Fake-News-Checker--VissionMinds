# 🧠 FakeCheck Models Overview

This document defines the data models (MongoDB Schemas) for the FakeCheck AI-powered Fake News Detection web app.

---

## 🧍‍♂️ User Model

**Purpose:** Stores login details, role information, and verification history.

**Fields:**
- `name`: String — Full name of the user.
- `email`: String — Unique email address used for login.
- `password`: String — Hashed password for secure authentication.
- `role`: String — Either `"user"` or `"moderator"`.
- `history`: [ObjectId] — References to the user’s previous predictions.
- `createdAt`: Date — Timestamp when the user was created.

---

## 📰 Article Model

**Purpose:** Represents submitted articles or text snippets for analysis.

**Fields:**
- `title`: String — Extracted article title (if available).
- `content`: String — Text snippet or body content of the article.
- `url`: String — URL submitted by the user (optional).
- `domain`: String — Extracted domain name from the URL.
- `sourceReliabilityScore`: Number — Trust score for the domain (0–1).
- `relatedArticles`: [String] — List of verified or supporting source URLs.
- `submittedBy`: ObjectId — Reference to the `User` who submitted the article.
- `createdAt`: Date — Timestamp when the article was added.

---

## 🤖 Prediction Model

**Purpose:** Stores AI model results for submitted content.

**Fields:**
- `articleId`: ObjectId — Reference to the associated `Article`.
- `predictedLabel`: String — `"Likely True"`, `"Uncertain"`, or `"Likely False"`.
- `confidenceScore`: Number — AI model confidence score (0–1).
- `explanation`: String — Short explanation or reason from the AI model.
- `evidenceLinks`: [String] — Supporting or contradicting references.
- `createdAt`: Date — Timestamp for when prediction was generated.

---

## 💬 Feedback Model

**Purpose:** Stores community feedback for verification transparency.

**Fields:**
- `predictionId`: ObjectId — Reference to the associated `Prediction`.
- `userId`: ObjectId — Reference to the `User` who gave feedback.
- `vote`: String — `"upvote"` or `"downvote"`.
- `comment`: String — Optional text feedback or evidence link.
- `createdAt`: Date — Timestamp for when feedback was submitted.

---

## 🧩 Relationships Overview

- A **User** can submit many **Articles**.
- Each **Article** has one **Prediction**.
- Each **Prediction** can have multiple **Feedback** entries.
- Each **User** has a **history** of Predictions.

---

