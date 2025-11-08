const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    predictionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prediction',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vote: {
        type: String,
        enum: ['upvote', 'downvote'],
        required: true
    },
    comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Prevent duplicate feedback from same user on same prediction
feedbackSchema.index({ predictionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

