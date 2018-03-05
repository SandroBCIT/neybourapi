const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    body: { type: String, required: true },
    coords: {
        lat: { type: Number, required: true },
        long: { type: Number, required: true }
    },
    region: { type: String, require: true },
    toggle: { type: Boolean, required: true }
});

module.exports = mongoose.model('Post', postSchema);