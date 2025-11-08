# 🧠 FakeCheck - AI-Powered Fake News Detection & Verification System

A comprehensive backend API for detecting and verifying fake news using AI models and source credibility checking.

## 📋 Features

- **User Authentication**: JWT-based authentication with role-based access control (User/Moderator)
- **Article Submission**: Submit articles or text snippets for analysis
- **AI-Powered Analysis**: Integration with AI models for fake news detection
- **Source Credibility**: Automated source reliability scoring
- **Predictions**: Generate and store AI predictions with confidence scores
- **Community Feedback**: Upvote/downvote system with comments
- **User History**: Track user's verification history

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fakecheck-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   - `DB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `AI_API_URL`: AI model API endpoint (optional for development)
   - `AI_API_KEY`: API key for AI service (optional)

4. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
fakecheck-backend/
├── config/              # Configuration files
├── controllers/         # Business logic
├── models/              # Mongoose schemas
├── routes/              # API routes
├── middleware/          # Auth, error handling
├── services/            # External API integrations
├── utils/               # Helper functions
├── validations/         # Request validation
├── uploads/             # File uploads
├── app.js              # Express app setup
└── server.js           # Server entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Articles
- `POST /api/articles` - Submit article (Protected)
- `GET /api/articles` - Get all articles (Protected)
- `GET /api/articles/:id` - Get single article (Protected)
- `GET /api/articles/my-articles` - Get user's articles (Protected)
- `POST /api/articles/extract-domain` - Extract domain from URL (Protected)

### Predictions
- `POST /api/predictions` - Generate prediction (Protected)
- `GET /api/predictions` - Get all predictions (Protected)
- `GET /api/predictions/:id` - Get single prediction (Protected)
- `GET /api/predictions/article/:articleId` - Get prediction by article (Protected)

### Feedback
- `POST /api/feedback` - Submit feedback (Protected)
- `GET /api/feedback/prediction/:predictionId` - Get feedback for prediction (Protected)
- `GET /api/feedback/my-feedback` - Get user's feedback (Protected)
- `DELETE /api/feedback/:id` - Delete feedback (Protected)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📊 Models

### User
- Stores user credentials and role
- Tracks verification history

### Article
- Stores submitted articles
- Tracks source reliability score

### Prediction
- Stores AI model predictions
- Contains confidence scores and explanations

### Feedback
- Stores community feedback
- Supports upvotes/downvotes and comments

## 🤖 AI Integration

The system integrates with AI models for fake news detection. Currently, it uses a mock service for development. To integrate with your AI model:

1. Update `AI_API_URL` in `.env`
2. Configure `AI_API_KEY` if required
3. Modify `services/aiService.js` to match your API response format

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express-validator** - Input validation

## 📝 License

ISC

## 👥 Contributors

- Your Name

## 📞 Support

For support, email support@fakecheck.com or create an issue in the repository.

