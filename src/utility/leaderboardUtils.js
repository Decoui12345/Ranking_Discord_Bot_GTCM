const { MongoClient } = require('mongodb');
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;

async function getLeaderboardMessage() {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const database = client.db('rankPosition');
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



