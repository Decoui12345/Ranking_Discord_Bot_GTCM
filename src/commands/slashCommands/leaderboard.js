const { SlashCommandBuilder } = require('discord.js');
const { getLeaderboardMessage } = require('../../utility/leaderboardUtils.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard'),

    async execute(interaction) {
        try {
            const leaderboardMessage = await getLeaderboardMessage();
            interaction.reply({ content: leaderboardMessage });
        } catch (error) {
            console.error('Error executing leaderboard command:', error);
            interaction.reply({ content: 'Error executing leaderboard command' });
        }
    },
};






/**const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = 'rankPosition';
const leaderboardCollectionName = 'leaderboard';
const rankNames = {
    '1197029346188214273': 'testrole',
    '1197029372616515676': 'ofofofo',
    '1197029383072915456': 'oglyboogsd'
    // Add more ranks if necessary
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard of ranked users.'),

    async execute(interaction) {
        await interaction.deferReply();

        let client;
        try {
            client = new MongoClient(uri);
            await client.connect();
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            await interaction.editReply('🛑 Error: Something went wrong while trying to connect to the database. Please try again later.');
            return;
        }

        try {
            const database = client.db(dbName);
            const leaderboardCollection = database.collection(leaderboardCollectionName);

            const leaderboard = await leaderboardCollection.find().sort({ rank: 1, timestamp: 1 }).toArray();
            if (leaderboard.length === 0) {
                await interaction.editReply('No ranked users found.');
                return;
            }
            
          //console.log('rankNames:', rankNames);
            const groupedLeaderboard = leaderboard.reduce((acc, entry) => {

                const rankName = rankNames[entry.rank] || entry.rank;
                if (!acc[rankName]) {
                    acc[rankName] = [];
                }
                acc[rankName].push(`<@${entry.userId}>`);
                return acc;
            }, {});

            let leaderboardMessage = '**Leaderboard**\n\n';
            for (const [rank, users] of Object.entries(groupedLeaderboard)) {
                leaderboardMessage += `**${rank}**\n`;
                leaderboardMessage += users.join(', ') + '\n\n';
            }

            await interaction.editReply(leaderboardMessage);
        } catch (error) {
            console.error('Failed to fetch leaderboard from MongoDB:', error);
            await interaction.editReply('🛑 Error: Something went wrong while fetching the leaderboard. Please try again later.');
        } finally {
            try {
                await client.close();
            } catch (error) {
                console.error('Failed to close MongoDB connection:', error);
            }
        }
    }
};
**/