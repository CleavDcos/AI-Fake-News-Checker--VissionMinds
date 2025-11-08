const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Article content is required'],
        trim: true
    },
    url: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true; // URL is optional
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL'
        }
    },
    domain: {
        type: String,
        trim: true
    },
    sourceReliabilityScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
    },
    relatedArticles: [{
        type: String,
        trim: true
    }],
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Extract domain from URL before saving
articleSchema.pre('save', function(next) {
    if (this.url && !this.domain) {
        try {
            const urlObj = new URL(this.url);
            this.domain = urlObj.hostname.replace('www.', '');
        } catch (error) {
            // Invalid URL, skip domain extraction
        }
    }
    next();
});

module.exports = mongoose.model('Article', articleSchema);

