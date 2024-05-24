/**const { MongoClient } = require('mongodb');
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;

async function getLeaderboardMessage() {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('users');

        const leaderboard = await collection.aggregate([
            { $group: { _id: "$rank", users: { $push: { username: "$username", position: "$position" } } } },
            { $sort: { _id: 1 } }
        ]).toArray();

        //console.log(leaderboard);

        // Log the count of documents in the collection
        //const documentCount = await collection.countDocuments();
        //console.log(`Document count: ${documentCount}`);

        let message = 'Leaderboard:\n\n';
        leaderboard.forEach(rank => {
            message += `**Rank ${rank._id}**\n`;
            rank.users.forEach((user, index) => {
                message += `${index + 1}. ${user.username}\n`;
            });
            message += '\n';
        });

        return message;
    } finally {
        await client.close();
    }
}

module.exports = { getLeaderboardMessage };
**/
const { MongoClient } = require('mongodb');
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;

async function getLeaderboardMessage() {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('users');

        // Get all users sorted by rank and position
        const users = await collection.find({}).sort({ rank: 1, position: 1 }).toArray();

        // Group users by rank
        const groupedUsers = users.reduce((acc, user) => {
            if (!acc[user.rank]) {
                acc[user.rank] = [];
            }
            acc[user.rank].push(user.userId);
            return acc;
        }, {});

        // Construct the leaderboard message
        let message = 'Leaderboard:\n\n';
        for (const rank in groupedUsers) {
            message += `<@&${rank}>:\n `;
            message += groupedUsers[rank].map(userId => `<@${userId}>`).join(', ');
            message += '\n\n';
        }

        return message;
    } finally {
        await client.close();
    }
}

module.exports = { getLeaderboardMessage };



