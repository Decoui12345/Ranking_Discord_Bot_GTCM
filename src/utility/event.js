const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    status: { type: Boolean, default: false },
    /* days: { type: [String], required: true },  
    time: { type: String, required: true } */
});

module.exports = mongoose.model('Event', eventSchema);
