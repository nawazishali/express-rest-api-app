const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Comment', new Schema({
    content: {
        type: String,
        required: true
    },
    commentedOn: {
        type: Object,
        required: true
    },
    postedBy: {
        type: Object,
        required: true
    }

}, { timestamps: true }));