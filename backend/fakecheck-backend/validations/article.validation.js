const { body, validationResult } = require('express-validator');

const validateArticle = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Article content is required')
        .isLength({ min: 50 })
        .withMessage('Article content must be at least 50 characters'),
    body('title')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Title must not exceed 200 characters'),
    body('url')
        .optional()
        .isURL()
        .withMessage('Please provide a valid URL'),
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
    validateArticle
};

