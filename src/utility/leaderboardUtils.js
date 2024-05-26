/**const { MongoClient } = require('mongodb');
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

module.exports = { getLeaderboardMessage };**/


const { MongoClient } = require('mongodb');
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;

const MAX_MESSAGE_LENGTH = 2000;

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

        // Construct the leaderboard message parts
        let messageParts = [];
        let currentMessage = 'Leaderboard:\n\n';
        
        // Convert rank IDs to numbers before sorting
//const sortedRanks = Object.keys(users.rank).map(Number).sort((a, b) => a - b);
//console.log('Sorted Ranks:', sortedRanks); // Add this line to check the sorted ranks

// Construct the leaderboard message parts based on sorted ranks
for (const rank in groupedUsers) {
    
    let rankSection = `<@&${rank}>:\n `;
    rankSection += groupedUsers[rank].map(userId => `<@${userId}>`).join(', ');
    rankSection += '\n\n';

    // Check if adding this rank section would exceed the max message length
    if (currentMessage.length + rankSection.length > MAX_MESSAGE_LENGTH) {
        messageParts.push(currentMessage);
        currentMessage = rankSection;
    } else {
        currentMessage += rankSection;
    }
}


        // Add the last part
        if (currentMessage.length > 0) {
            messageParts.push(currentMessage);
        }

        return messageParts;
    } finally {
        await client.close();
    }
}

module.exports = { getLeaderboardMessage };
