const mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
    content: String,
    author: String,
    date: {type: Date, default: Date.now}
});

module.exports = new mongoose.model('Comment', commentSchema);
