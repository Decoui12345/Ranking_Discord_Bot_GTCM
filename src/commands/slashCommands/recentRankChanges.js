const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const dbName = 'rankPosition';
const collectionName = 'rank_history';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recent-rank-changes')
        .setDescription('This command will show the recent changes to the ranks.'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const client = new MongoClient(uri);
        let pages = [];
        const limit = 5;

        try {
            await client.connect();
            const database = client.db(dbName);
            const collection = database.collection(collectionName);

            const recentChangesCursor = collection.find().sort({ timestamp: -1 }).limit(10);
            const recentChanges = await recentChangesCursor.toArray();

            if (recentChanges.length > 0) {
                for (let i = 0; i < recentChanges.length; i += limit) {
                    const slicedChanges = recentChanges.slice(i, i + limit);
                    let changesContent = slicedChanges.map(entry => {
                        const user = `<@${entry.userId}>`;
                        const role = `<@&${entry.role}>`;
                        const rank = `<@&${entry.rank}>`;
                        const timestamp = new Date(entry.timestamp).toLocaleString("en-US", { timeZone: "America/New_York" });
                        const positionChange = entry.oldPosition !== undefined && entry.newPosition !== undefined 
                            ? `- ${user} Moved ${entry.direction} in ${rank} by ${Math.abs(entry.newPosition - entry.oldPosition)} spot(s) on ${timestamp} EST`
                            : `- ${user} moved to ${role} on ${timestamp} EST`;
                        return positionChange;
                    }).join('\n\n');

                    let changesEmbed = new EmbedBuilder()
                        .setTitle('Recent Rank Changes⌛')
                        .setDescription(changesContent)
                        .setColor('Random')
                        .setTimestamp();

                    pages.push(changesEmbed);
                }
            } else {
                let noChangesEmbed = new EmbedBuilder()
                    .setTitle('Recent Rank Changes')
                    .setDescription('No recent rank changes found')
                    .setColor('Random')
                    .setTimestamp();

                pages.push(noChangesEmbed);
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
        const message = await interaction.editReply({ embeds: [pages[currentPage]], components: [row], ephemeral: true });

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
                try {
                        await message.edit({ components: [disabledRow] });
                } catch (error) {
                    if (error.code === 10008) {
                        console.warn('Message was already deleted, cannot edit.');
                    } else {
                        console.error('Error disabling buttons:', error);
                    }
                }
        });
    }
};
