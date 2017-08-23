const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Project', new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Object,
        required: true,
    },
    users: []

}, { timestamps: true }));
