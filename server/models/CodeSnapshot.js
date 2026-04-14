const mongoose = require('mongoose');

const CodeSnapshotSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        default: '// Write your code here...',
    },
    language: {
        type: String, // e.g. 'javascript', optionally saved if needed later
        default: 'javascript'
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('CodeSnapshot', CodeSnapshotSchema);
