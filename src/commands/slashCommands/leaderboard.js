/**const { SlashCommandBuilder } = require('discord.js');
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
};**/

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getLeaderboardMessage } = require('../../utility/leaderboardUtils'); // Adjust the path as necessary

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        await interaction.deferReply();
        
        try {
            let messagesSent = false; // Flag to track whether messages have been sent
            const messageParts = await getLeaderboardMessage();
            for (const part of messageParts) {
                await interaction.channel.send({ content: part });
            }

            // Once all parts of the message have been sent, set the flag to true
            messagesSent = true;
            console.log('Leaderboard messages sent successfully.');

            // Further processing can be added here if necessary

            if (messagesSent) {
                await interaction.editReply('Ranked');
            }

        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            await interaction.reply('An error occurred while fetching the leaderboard.');
        }

    },
};
