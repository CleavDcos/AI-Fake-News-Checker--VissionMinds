const express = require('express');
const router = express.Router();
const {
    submitFeedback,
    getFeedbackByPrediction,
    getMyFeedback,
    deleteFeedback
} = require('../controllers/feedback.controller');
const { protect } = require('../middleware/authMiddleware');
const { validateFeedback } = require('../validations/feedback.validation');

router.use(protect); // All routes require authentication

router.post('/', validateFeedback, submitFeedback);
router.get('/my-feedback', getMyFeedback);
router.get('/prediction/:predictionId', getFeedbackByPrediction);

router.delete('/:id', deleteFeedback);

module.exports = router;

