const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
        unique: true // One prediction per article
    },
    predictedLabel: {
        type: String,
        enum: ['Likely True', 'Uncertain', 'Likely False'],
        required: true
    },
    confidenceScore: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    explanation: {
        type: String,
        required: true,
        trim: true
    },
    evidenceLinks: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prediction', predictionSchema);

