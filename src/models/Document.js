const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospitalName: { type: String, required: true },
    healthIssue: { type: String, required: true },
    documentType: { type: String, enum: ['Image', 'PDF'], required: true },
    documentPath: { type: String, required: true },
    summary: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', DocumentSchema);