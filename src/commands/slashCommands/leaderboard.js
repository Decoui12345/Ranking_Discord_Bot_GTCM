const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getLeaderboardMessage } = require('../../utility/leaderboardUtils');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
async execute(interaction) {
        await interaction.deferReply();
        console.log(`User: ${interaction.user.tag} executed the command: /leaderboard.`);
try {
    // Fetch leaderboard message parts
    const messageParts = await getLeaderboardMessage();

    // Flag to track whether messages have been sent
    let messagesSent = false;

    for (const part of messageParts) {
        await interaction.channel.send({ content: part, allowedMentions: { parse: [] } });
    }

    // Once all parts of the message have been sent, set the flag to true
    messagesSent = true;
    console.log('Leaderboard messages sent successfully.');

    if (messagesSent) {
        await interaction.editReply('Ranked');
    }

} catch (error) {
    console.error('Error fetching leaderboard:', error);
    await interaction.reply('An error occurred while fetching the leaderboard.');
}
    }
};
