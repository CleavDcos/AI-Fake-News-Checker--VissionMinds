const Article = require('../models/Article');
const Prediction = require('../models/Prediction');
const Feedback = require('../models/Feedback');
const asyncHandler = require('../utils/asyncHandler');
const sourceCheckService = require('../services/sourceCheckService');

// @desc    Submit a new article for verification
// @route   POST /api/articles
// @access  Private
const submitArticle = asyncHandler(async (req, res) => {
    const { title, content, url, relatedArticles } = req.body;

    // Validate required fields
    if (!content || content.trim().length < 50) {
        return res.status(400).json({
            success: false,
            message: 'Article content is required and must be at least 50 characters'
        });
    }

    // Create article
    const article = await Article.create({
        title: title?.trim() || null,
        content: content.trim(),
        url: url?.trim() || null,
        relatedArticles: relatedArticles || [],
        submittedBy: req.user.id
    });

    // Check source reliability if domain was extracted
    if (article.domain) {
        try {
            const reliabilityScore = await sourceCheckService.checkSourceReliability(article.domain);
            article.sourceReliabilityScore = reliabilityScore;
            await article.save();
        } catch (error) {
            console.error('Error checking source reliability:', error);
            // Continue even if source check fails
        }
    }

    // Populate user info before sending response
    await article.populate('submittedBy', 'name email');

    res.status(201).json({
        success: true,
        message: 'Article submitted successfully',
        data: article
    });
});

// @desc    Get all articles with pagination and filtering
// @route   GET /api/articles
// @access  Private
const getArticles = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query for filtering
    const query = {};
    
    // Filter by domain if provided
    if (req.query.domain) {
        query.domain = { $regex: req.query.domain, $options: 'i' };
    }

    // Filter by source reliability score range
    if (req.query.minReliability) {
        query.sourceReliabilityScore = { $gte: parseFloat(req.query.minReliability) };
    }
    if (req.query.maxReliability) {
        query.sourceReliabilityScore = {
            ...query.sourceReliabilityScore,
            $lte: parseFloat(req.query.maxReliability)
        };
    }

    // Search in title and content
    if (req.query.search) {
        query.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { content: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    // Filter by user if provided (for moderators)
    if (req.query.userId && req.user.role === 'moderator') {
        query.submittedBy = req.query.userId;
    }

    // Execute query with pagination
    const articles = await Article.find(query)
        .populate('submittedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Get total count for pagination
    const total = await Article.countDocuments(query);

    res.status(200).json({
        success: true,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        count: articles.length,
        data: articles
    });
});

// @desc    Get single article with prediction and feedback
// @route   GET /api/articles/:id
// @access  Private
const getArticle = asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id.trim())
        .populate('submittedBy', 'name email role');

    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article not found'
        });
    }

    // Get prediction if exists
    const prediction = await Prediction.findOne({ articleId: article._id });

    // Get feedbacks for the prediction if it exists
    let feedbacks = null;
    let feedbackStats = null;
    if (prediction) {
        feedbacks = await Feedback.find({ predictionId: prediction._id })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(50); // Limit to recent 50 feedbacks

        // Calculate feedback statistics
        const allFeedbacks = await Feedback.find({ predictionId: prediction._id });
        feedbackStats = {
            total: allFeedbacks.length,
            upvotes: allFeedbacks.filter(f => f.vote === 'upvote').length,
            downvotes: allFeedbacks.filter(f => f.vote === 'downvote').length
        };
    }

    res.status(200).json({
        success: true,
        data: {
            article,
            prediction: prediction || null,
            feedbacks: feedbacks || [],
            feedbackStats: feedbackStats || { total: 0, upvotes: 0, downvotes: 0 }
        }
    });
});

// @desc    Get user's articles with pagination
// @route   GET /api/articles/my-articles
// @access  Private
const getMyArticles = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { submittedBy: req.user.id };

    // Search in user's articles
    if (req.query.search) {
        query.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { content: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    const articles = await Article.find(query)
        .populate('submittedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Article.countDocuments(query);

    res.status(200).json({
        success: true,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        count: articles.length,
        data: articles
    });
});

// @desc    Update article (only by owner or moderator)
// @route   PUT /api/articles/:id
// @access  Private
const updateArticle = asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id.trim());

    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article not found'
        });
    }

    // Check if user owns the article or is a moderator
    if (article.submittedBy.toString() !== req.user.id && req.user.role !== 'moderator') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this article'
        });
    }

    // Update allowed fields
    const { title, content, url, relatedArticles } = req.body;
    
    if (title !== undefined) article.title = title.trim() || null;
    if (content !== undefined) {
        if (content.trim().length < 50) {
            return res.status(400).json({
                success: false,
                message: 'Content must be at least 50 characters'
            });
        }
        article.content = content.trim();
    }
    if (url !== undefined) {
        article.url = url.trim() || null;
        // Re-extract domain if URL changed
        if (article.url) {
            try {
                const urlObj = new URL(article.url);
                article.domain = urlObj.hostname.replace('www.', '');
                // Re-check source reliability
                const reliabilityScore = await sourceCheckService.checkSourceReliability(article.domain);
                article.sourceReliabilityScore = reliabilityScore;
            } catch (error) {
                // Invalid URL, keep existing domain
            }
        }
    }
    if (relatedArticles !== undefined) article.relatedArticles = relatedArticles;

    await article.save();
    await article.populate('submittedBy', 'name email');

    res.status(200).json({
        success: true,
        message: 'Article updated successfully',
        data: article
    });
});

// @desc    Delete article (only by owner or moderator)
// @route   DELETE /api/articles/:id
// @access  Private
const deleteArticle = asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id.trim());

    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article not found'
        });
    }

    // Check if user owns the article or is a moderator
    if (article.submittedBy.toString() !== req.user.id && req.user.role !== 'moderator') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this article'
        });
    }

    // Delete associated prediction and feedbacks
    const prediction = await Prediction.findOne({ articleId: article._id });
    if (prediction) {
        await Feedback.deleteMany({ predictionId: prediction._id });
        await Prediction.findByIdAndDelete(prediction._id);
    }

    // Delete the article
    await article.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Article deleted successfully'
    });
});

// @desc    Extract domain from URL and get source info
// @route   POST /api/articles/extract-domain
// @access  Private
const extractDomain = asyncHandler(async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: 'URL is required'
        });
    }

    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        
        // Get source information including reliability score
        const sourceInfo = await sourceCheckService.getSourceInfo(domain);

        res.status(200).json({
            success: true,
            data: {
                domain: sourceInfo.domain,
                sourceReliabilityScore: sourceInfo.reliabilityScore,
                category: sourceInfo.category,
                verified: sourceInfo.verified
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid URL format'
        });
    }
});

module.exports = {
    submitArticle,
    getArticles,
    getArticle,
    getMyArticles,
    updateArticle,
    deleteArticle,
    extractDomain
};

