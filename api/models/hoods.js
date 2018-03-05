const mongoose = require('mongoose');

const hoodsSchema = mongoose.Schema({
    regions: { type: JSON, required: true }
});

module.exports = mongoose.model('Hoods', hoodsSchema);