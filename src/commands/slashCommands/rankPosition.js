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
            '1143694702042947614', // diamond
            '1143698998872514560', // plat
            '1143697130511409193', // gold
            '1143704641398386718', // silver
            '1143702378244219050', // iron
            '1201228978183221439', // copper
            '1143970454382596096', // unranked
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
                        historyDescription += `${entry.role} - ${entry.timestamp.toLocaleString()} EST\n`;
                    });
                
                    whatRankE.addFields({ name: 'Rank History', value: historyDescription });
                } else {
                    whatRankE.addFields({ name: 'Rank History', value: 'No rank history found'});
                }
                
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
