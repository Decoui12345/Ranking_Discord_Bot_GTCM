const mongoose = require('mongoose');
const Leaderboard = require('./src/utility/leaderboardSchema');
const MemberRank = require('./src/utility/memberRankSchema');

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if connection fails
    }
}

// Function to save leaderboard data to the database
async function saveLeaderboardData(roleId, members) {
    try {
        await Leaderboard.updateOne(
            { roleId },
            { $set: { members } },
            { upsert: true }
        );
        console.log('Leaderboard data saved successfully.');
    } catch (error) {
        console.error('Error saving leaderboard data:', error);
    }
}

// Function to retrieve leaderboard data from the database
async function getLeaderboardData(roleId) {
    try {
        const result = await Leaderboard.findOne({ roleId });
        return result ? result.members : [];
    } catch (error) {
        console.error('Error getting leaderboard data:', error);
        return [];
    }
}

// Function to save member rank to the database
async function saveMemberRank(memberId, rank) {
    try {
        // Check if the member rank already exists in the database
        let existingMemberRank = await MemberRank.findOne({ memberId });

        // If the member rank exists, update it; otherwise, create a new entry
        if (existingMemberRank) {
            existingMemberRank.rank = rank;
            await existingMemberRank.save();
        } else {
            await MemberRank.create({ memberId, rank });
        }

        console.log(`Member rank saved: Member ID ${memberId}, Rank ${rank}`);
    } catch (error) {
        console.error('Error saving member rank:', error);
    }
}

module.exports = { connectToMongoDB, saveLeaderboardData, getLeaderboardData, saveMemberRank };
