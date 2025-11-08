fakecheck-backend/
│
├── config/                          # Configuration files (DB, environment, etc.)
│   └── db.js
│
├── controllers/                     # Business logic for each model
│   ├── auth.controller.js           # User registration, login, JWT handling
│   ├── article.controller.js        # Article submission, retrieval, domain parsing
│   ├── prediction.controller.js     # AI model integration and prediction storage
│   └── feedback.controller.js       # User votes, comments, and community feedback
│
├── models/                          # Mongoose schemas
│   ├── User.js
│   ├── Article.js
│   ├── Prediction.js
│   └── Feedback.js
│
├── routes/                          # API routes (link routes to controllers)
│   ├── auth.routes.js
│   ├── article.routes.js
│   ├── prediction.routes.js
│   └── feedback.routes.js
│
├── middleware/                      # Auth, error handling, validation, etc.
│   ├── authMiddleware.js            # JWT authentication middleware
│   └── errorMiddleware.js           # Global error handler
│
├── services/                        # External API integrations (AI, credibility check)
│   ├── aiService.js                 # Communicates with Google Colab LLM API
│   └── sourceCheckService.js        # Evaluates news source credibility
│
├── utils/                           # Helper functions
│   ├── generateToken.js             # JWT generation helper
│   └── logger.js                    # Optional request/response logger
│
├── uploads/                         # For image/meme verification (optional)
│   └── images/
│
├── validations/                     # Joi or express-validator schemas (optional)
│   ├── user.validation.js
│   ├── article.validation.js
│   └── feedback.validation.js
│
├── app.js                           # Main Express app setup
├── server.js                        # Entry point — starts the server
├── .env                             # Environment variables (PORT, DB_URI, JWT_SECRET)
├── package.json
└── README.md
