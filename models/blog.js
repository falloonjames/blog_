const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    url: String,
    body: String,
    date: {type: Date, default: Date.now},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Blog', blogSchema);