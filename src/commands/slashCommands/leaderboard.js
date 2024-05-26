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