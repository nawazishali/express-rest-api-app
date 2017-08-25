const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Issue', new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    project: {
        type: Object,
        required: true
    },
    assignee: {
        type: Object,
    },
    creator: {
        type: Object,
        required: true
    },
    state: {
        type: String,
        required: true
    }

}, { timestamps: true }));