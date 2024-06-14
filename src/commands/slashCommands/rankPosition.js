/**const { MongoClient } = require('mongodb');
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
        console.log(`User: ${interaction.user.tag} executed the command: /what-rank-is.`);
        const ranks = [ 
            '1143694702042947614', // diamond
            '1143697130511409193', // plat
            '1143698998872514560', // gold
            '1143702378244219050', // silver
            '1143704641398386718', // iron
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
};**/






const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

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
        console.log(`User: ${interaction.user.tag} executed the command: /what-rank-is.`);
        const ranks = [
            '1143694702042947614', // diamond
            '1143697130511409193', // plat
            '1143698998872514560', // gold
            '1143702378244219050', // silver
            '1143704641398386718', // iron
            '1201228978183221439', // copper
            '1143970454382596096', // unranked
        ];

        const userRank = ranks.filter(roleId => user.roles.cache.has(roleId));
        const roleMentions = userRank.map(roleId => `<@&${roleId}>`).join(', ');
        const baseEmbed = new EmbedBuilder()
            .setTitle('Rank:')
            .setDescription(`${user} is currently ${roleMentions} tier`)
            .setColor('Random')
            .setThumbnail(user.displayAvatarURL());

        const client = new MongoClient(uri);
        let pages = [];
        try {
            await client.connect();
            const database = client.db(dbName);
            const collection = database.collection(collectionName);

            const rankCursor = collection.find({ userId: user.id, role: { $in: ranks } });
            const positionCursor = collection.find({ userId: user.id, rank: { $in: ranks } });
            const rankHistory = await rankCursor.toArray();
            const positionHistory = await positionCursor.toArray();

            if (rankHistory.length > 0) {
                // First page: current rank and complete rank history
                let firstPageContent = rankHistory.map(entry => `<@&${entry.role}> - ${new Date(entry.timestamp).toLocaleString()} EST`).join('\n');
                let firstPageEmbed = new EmbedBuilder(baseEmbed).addFields({ name: 'Rank History', value: firstPageContent });
                pages.push(firstPageEmbed);

                // Subsequent pages: current rank and detailed rank position history
                let detailedHistoryContent = "";
                positionHistory.forEach((entry, index) => {
                    const oldPosition = entry.oldPosition;
                    const newPosition = entry.newPosition;
                    const positionDifference = Math.abs(newPosition - oldPosition);

                    detailedHistoryContent += `Moved ${entry.direction} in <@&${entry.rank}> by ${positionDifference} spot(s) - ${new Date(entry.timestamp).toLocaleString()} EST\n`;
                    if ((index + 1) % 10 === 0 || index === positionHistory.length - 1) {
                        let pageEmbed = new EmbedBuilder(baseEmbed).addFields({ name: 'Rank Position History', value: detailedHistoryContent });
                        pages.push(pageEmbed);
                        detailedHistoryContent = "";
                    }
                });
            } else {
                let noHistoryEmbed = new EmbedBuilder(baseEmbed).addFields({ name: 'Rank History', value: 'No rank history found' });
                pages.push(noHistoryEmbed);
            }
        } finally {
            await client.close();
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
            );

        let currentPage = 0;
        const message = await interaction.reply({ embeds: [pages[currentPage]], components: [row], fetchReply: true, ephemeral: true });

        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'previous') {
                currentPage = currentPage > 0 ? --currentPage : pages.length - 1;
            } else if (i.customId === 'next') {
                currentPage = currentPage + 1 < pages.length ? ++currentPage : 0;
            }

            await i.update({ embeds: [pages[currentPage]], components: [row] });
        });

        collector.on('end', async () => {
            const disabledRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                );
            message.edit({ components: [disabledRow] });
        });
    }
};
