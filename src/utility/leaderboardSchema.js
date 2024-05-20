const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    roleId: { type: String, required: true, unique: true },
    members: { type: [String], required: true },
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
