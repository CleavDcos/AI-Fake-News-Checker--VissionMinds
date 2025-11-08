const express = require('express');
const router = express.Router();
const {
    generatePrediction,
    getPredictions,
    getPrediction,
    getPredictionByArticle
} = require('../controllers/prediction.controller');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes require authentication

router.post('/', generatePrediction);
router.get('/', getPredictions);
router.get('/article/:articleId', getPredictionByArticle);
router.get('/:id', getPrediction);

module.exports = router;

