const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
//Route files
const authRoutes = require('./routes/auth.routes');
const articleRoutes = require('./routes/article.routes');
const predictionRoutes = require('./routes/prediction.routes');
const feedbackRoutes = require('./routes/feedback.routes');
// Load env vars
dotenv.config();

// Connect to database
connectDB();
//6CHiCaPsreRerjFf
//cleavendcosta_db_user


const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    app.use(logger);
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'FakeCheck API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handler (must be last middleware)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;

