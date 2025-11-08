const Feedback = require('../models/Feedback');
const Prediction = require('../models/Prediction');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Submit feedback for a prediction
// @route   POST /api/feedback
// @access  Private
const submitFeedback = asyncHandler(async (req, res) => {
    const { predictionId, vote, comment } = req.body;

    // Check if prediction exists
    const prediction = await Prediction.findById(predictionId);
    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found'
        });
    }

    // Check if user already gave feedback
    const existingFeedback = await Feedback.findOne({
        predictionId,
        userId: req.user.id
    });

    if (existingFeedback) {
        // Update existing feedback
        existingFeedback.vote = vote;
        existingFeedback.comment = comment;
        await existingFeedback.save();

        return res.status(200).json({
            success: true,
            message: 'Feedback updated',
            data: existingFeedback
        });
    }

    // Create new feedback
    const feedback = await Feedback.create({
        predictionId,
        userId: req.user.id,
        vote,
        comment
    });

    res.status(201).json({
        success: true,
        data: feedback
    });
});

// @desc    Get all feedback for a prediction
// @route   GET /api/feedback/prediction/:predictionId
// @access  Private
const getFeedbackByPrediction = asyncHandler(async (req, res) => {
    const feedbacks = await Feedback.find({ predictionId: req.params.predictionId.trim() })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });

    // Calculate vote statistics
    const upvotes = feedbacks.filter(f => f.vote === 'upvote').length;
    const downvotes = feedbacks.filter(f => f.vote === 'downvote').length;

    res.status(200).json({
        success: true,
        count: feedbacks.length,
        statistics: {
            upvotes,
            downvotes,
            total: feedbacks.length
        },
        data: feedbacks
    });
});

// @desc    Get user's feedback
// @route   GET /api/feedback/my-feedback
// @access  Private
const getMyFeedback = asyncHandler(async (req, res) => {
    const feedbacks = await Feedback.find({ userId: req.user.id })
        .populate('predictionId')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: feedbacks.length,
        data: feedbacks
    });
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
const deleteFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        return res.status(404).json({
            success: false,
            message: 'Feedback not found'
        });
    }

    // Make sure user owns the feedback
    if (feedback.userId.toString() !== req.user.id && req.user.role !== 'moderator') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this feedback'
        });
    }

    await feedback.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Feedback deleted successfully'
    });
});

module.exports = {
    submitFeedback,
    getFeedbackByPrediction,
    getMyFeedback,
    deleteFeedback
};

