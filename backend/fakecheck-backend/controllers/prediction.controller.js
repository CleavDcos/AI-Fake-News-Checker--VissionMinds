const Prediction = require('../models/Prediction');
const Article = require('../models/Article');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const aiService = require('../services/aiService');
const mongoose = require('mongoose');
// @desc    Generate prediction for an article
// @route   POST /api/predictions
// @access  Private
const generatePrediction = asyncHandler(async (req, res) => {
    const { articleId } = req.body;

    // Check if article exists
   // Check if article exists safely
const mongoose = require('mongoose');

const id = articleId.trim();
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ success: false, message: 'Invalid article ID' });
}
const article = await Article.findById(id);
if (!article) {
  return res.status(404).json({ success: false, message: 'Article not found' });
}


    // Check if prediction already exists
    let prediction = await Prediction.findOne({ articleId });
    if (prediction) {
        return res.status(200).json({
            success: true,
            message: 'Prediction already exists',
            data: prediction
        });
    }

  const generatePrediction = async (req, res) => {
    try {
        const { articleId, title, content, url, domain, sourceReliabilityScore } = req.body;

        // Call AI service
        const aiResponse = await aiService.analyzeArticle({
            title,
            content,
            url,
            domain,
            sourceReliabilityScore
        });

        // Save prediction to DB
        const prediction = await Prediction.create({
            article: articleId,
            user: req.user.id,
            label: aiResponse.label,
            confidence: aiResponse.confidence,
            explanation: aiResponse.explanation,
            evidenceLinks: aiResponse.evidenceLinks
        });

        res.status(201).json({
            success: true,
            data: prediction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Prediction generation failed' });
    }
};
    // Create prediction
    prediction = await Prediction.create({
        articleId: article._id,
        predictedLabel: aiResponse.label,
        confidenceScore: aiResponse.confidence,
        explanation: aiResponse.explanation,
        evidenceLinks: aiResponse.evidenceLinks || []
    });

    // Add prediction to user's history
    await User.findByIdAndUpdate(
        article.submittedBy,
        { $push: { history: prediction._id } },
        { new: true }
    );

    res.status(201).json({
        success: true,
        data: prediction
    });
});

// @desc    Get all predictions
// @route   GET /api/predictions
// @access  Private
const getPredictions = asyncHandler(async (req, res) => {
    const predictions = await Prediction.find()
        .populate('articleId')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: predictions.length,
        data: predictions
    });
});

// @desc    Get single prediction
// @route   GET /api/predictions/:id
// @access  Private
const getPrediction = asyncHandler(async (req, res) => {
    const prediction = await Prediction.findById(req.params.id.trim())
        .populate({
            path: 'articleId',
            populate: {
                path: 'submittedBy',
                select: 'name email'
            }
        });

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found'
        });
    }

    res.status(200).json({
        success: true,
        data: prediction
    });
});

// @desc    Get prediction by article ID
// @route   GET /api/predictions/article/:articleId
// @access  Private
const getPredictionByArticle = asyncHandler(async (req, res) => {
    const prediction = await Prediction.findOne({ articleId: req.params.articleId.trim() })
        .populate({
            path: 'articleId',
            populate: {
                path: 'submittedBy',
                select: 'name email'
            }
        });

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found for this article'
        });
    }

    res.status(200).json({
        success: true,
        data: prediction
    });
});

module.exports = {
    generatePrediction,
    getPredictions,
    getPrediction,
    getPredictionByArticle
};

