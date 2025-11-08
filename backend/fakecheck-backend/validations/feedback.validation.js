const { body, validationResult } = require('express-validator');

const validateFeedback = [
    body('predictionId')
        .notEmpty()
        .withMessage('Prediction ID is required')
        .isMongoId()
        .withMessage('Invalid prediction ID'),
    body('vote')
        .notEmpty()
        .withMessage('Vote is required')
        .isIn(['upvote', 'downvote'])
        .withMessage('Vote must be either "upvote" or "downvote"'),
    body('comment')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Comment must not exceed 500 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = {
    validateFeedback
};

