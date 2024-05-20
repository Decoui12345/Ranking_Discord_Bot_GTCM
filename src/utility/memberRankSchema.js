const mongoose = require('mongoose');

// Define the schema for member ranks
const memberRankSchema = new mongoose.Schema({
    memberId: { type: String, required: true }, // Discord user ID
    rank: { type: String, required: true }      // Member's rank
});

// Define and export the model for member ranks
module.exports = mongoose.model('MemberRank', memberRankSchema);
