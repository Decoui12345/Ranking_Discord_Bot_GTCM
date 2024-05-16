const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const uri = process.env.MONGODB_URI

const dbName = 'rankPosition';
const collectionName = 'rank_history';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('what-rank-is')
    .setDescription('Displays what rank someone is.')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('What rank is this user?')
            .setRequired(true)
    ),

    async execute(interaction) {
        const user = interaction.options.getMember('user');   

        const ranks = [ 
            '1197029346188214273', // testrole
            '1197029372616515676', // ofofofo
            '1197029383072915456' // oglyboogsd
        ];

        const userRank = [];
 // Check if the user has any of the specified roles
        ranks.forEach(roleId => {
            if (user.roles.cache.has(roleId)) {
               userRank.push(roleId);
            }
        });

// If user has at least one ranked role
    if (userRank.length > 0) {
        const roleMentions = userRank.map(roleId => `<@&${roleId}>`).join(', ');

            // If user has no ranked roles
        
                const whatRankE = new EmbedBuilder()
                .setTitle('Rank: ')
                .setDescription(`${user} is currently ${roleMentions} tier`)
                .setColor('Random')
                .setThumbnail(user.displayAvatarURL());

            // Fetch rank history from MongoDB
            const client = new MongoClient(uri);
            try {
                await client.connect();
                const database = client.db(dbName);
                const collection = database.collection(collectionName);

                // Find all documents with the given user ID
                const cursor = collection.find({ userId: user.id });
                const history = await cursor.toArray();
                
                if (history.length > 0) {
                    let historyDescription = "";
                    history.forEach(entry => {
                        historyDescription += `${entry.role} - ${entry.timestamp.toLocaleString()}\n`;
                    });
                
                    whatRankE.addFields({ name: 'Rank History', value: historyDescription });
                } else {
                    whatRankE.addFields({ name: 'Rank History', value: 'No rank history found'});
                }
                
                /**if (history.length > 0) {
                    const historyDescription = history.map(entry => `${entry.role} - ${entry.timestamp.toLocaleString()}`).join('\n');
                    whatRankE.addFields({ name: 'Rank History', value: historyDescription });
                    console.log(historyDescription);
                } else {
                    whatRankE.addFields({ name: 'Rank History', value: 'No rank history found'});
                }**/
            } finally {
                await client.close();
            }

            await interaction.reply({ embeds: [whatRankE], ephemeral: true }); 
            }
            else {
                const noRole = new EmbedBuilder()
                .setTitle(`🛑 That user doesn't have the ranking roles.`)
                .setDescription('Please try again after they are either unranked or have a ranked role on them.');

                await interaction.reply({ embeds: [noRole], ephemeral: true });
            }

        }
};


/** const { SlashCommandBuilder } = require('discord.js');
const Database = require('your-database-library'); // Replace with your actual database library

module.exports = {
    data: new SlashCommandBuilder()
        .setName('what-rank-is')
        .setDescription('Displays what rank someone is.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('What rank is this user?')
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getMember('user');

        const ranks = [
            { id: '1197029346188214273', name: 'testrole' },
            { id: '1197029372616515676', name: 'ofofofo' },
            { id: '1197029383072915456', name: 'oglyboogsd' }
        ];

        const db = new Database(); // Initialize your database connection

        // Fetch role history for the user from the database
        const roleHistory = await db.getRoleHistory(user.id);

        const rankedRoles = roleHistory.filter(entry => ranks.some(rank => rank.id === entry.roleId));

        if (rankedRoles.length > 0) {
            const roleHistoryText = rankedRoles.map(entry => {
                const roleName = ranks.find(rank => rank.id === entry.roleId).name;
                return `${roleName} (${new Date(entry.timestamp).toLocaleString()})`;
            }).join('\n');

            const whatRankE = new Discord.MessageEmbed()
                .setTitle('Rank History:')
                .setDescription(`Rank history for ${user}:\n${roleHistoryText}`)
                .setColor('RANDOM')
                .setThumbnail(user.user.displayAvatarURL());

            await interaction.reply({ embeds: [whatRankE], ephemeral: true });
        } else {
            const noRole = new Discord.MessageEmbed()
                .setTitle(`🛑 That user doesn't have any of the ranking roles.`)
                .setDescription('Please try again after they are either unranked or have a ranked role on them.');

            await interaction.reply({ embeds: [noRole], ephemeral: true });
        }
    }
};

 **/





/**
const { Schema, model } = require('mongoose');

// Define a schema for user role history
const roleHistorySchema = new Schema({
  userId: String,
  roleId: String,
  timestamp: { type: Date, default: Date.now },
});

// Create a model for user role history
const RoleHistory = model('RoleHistory', roleHistorySchema);



// Assuming `RoleHistory` model is defined

// Save role history for a user
const saveRoleHistory = async (userId, roleId) => {
    const roleHistory = new RoleHistory({
      userId,
      roleId,
    });
    await roleHistory.save();
  };
**/  