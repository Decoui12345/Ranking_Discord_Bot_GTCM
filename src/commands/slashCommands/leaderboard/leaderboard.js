const { SlashCommandBuilder } = require('discord.js');
const { getLeaderboardData } = require('../../../../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard based on rank hierarchy.'),
    
    async execute(interaction) {
        await interaction.deferReply();

        const guild = interaction.guild;
        if (!guild) {
            await interaction.editReply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        await guild.members.fetch();

        const rankRoles = [
            { id: '1197029346188214273', name: 'Test Role' },
            { id: '1197029372616515676', name: 'Ofofofo' },
            { id: '1197029383072915456', name: 'Ooglyboogsd' },
        ];

        const rankedMembers = {};

        for (const { id, name } of rankRoles) {
            const role = guild.roles.cache.get(id);
            if (role) {
                const membersWithRole = role.members.map(member => member.user);
                const sortedMembers = await getLeaderboardData(id) || membersWithRole;
                rankedMembers[name] = sortedMembers;
            }
        }

        if (Object.keys(rankedMembers).length === 0) {
            await interaction.editReply({ content: 'No members with rank roles found.', ephemeral: true });
            return;
        }

        let leaderboardText = '🏆 **Rank Leaderboard** 🏆\n\n';

        for (const rankName in rankedMembers) {
            leaderboardText += `**${rankName}**\n`;
            const memberNames = rankedMembers[rankName].map(user => user.displayName).join(', ');
            leaderboardText += `${memberNames}\n\n`;
        }

        const chunkSize = 2000;
        const chunks = [];
        for (let i = 0; i < leaderboardText.length; i += chunkSize) {
            chunks.push(leaderboardText.slice(i, i + chunkSize));
        }

        for (const chunk of chunks) {
            await interaction.followUp({ content: chunk });
        }
    },
};
