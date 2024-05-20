const { SlashCommandBuilder } = require('discord.js');
const { saveLeaderboardData, getLeaderboardData } = require('../../../../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editleaderboard')
        .setDescription('Edit the position of a user within the leaderboard.')
        .addRoleOption(option => option.setName('role').setDescription('The role of the user').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('The user to move').setRequired(true))
        .addIntegerOption(option => option.setName('position').setDescription('The new position').setRequired(true)),
    
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const user = interaction.options.getUser('user');
        const position = interaction.options.getInteger('position');

        const guild = interaction.guild;
        if (!guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        await guild.members.fetch();

        const roleMembers = role.members.map(member => member.user);
        if (!roleMembers.includes(user)) {
            await interaction.reply({ content: 'The user does not have the specified role.', ephemeral: true });
            return;
        }

        const updatedRoleMembers = roleMembers.filter(member => member.id !== user.id);

        if (position < 1 || position > updatedRoleMembers.length + 1) {
            await interaction.reply({ content: 'Invalid position specified.', ephemeral: true });
            return;
        }

        updatedRoleMembers.splice(position - 1, 0, user);

        await saveLeaderboardData(role.id, updatedRoleMembers);

        await interaction.reply({ content: `Updated ${user}'s position to ${position} in the ${role.name} role.` });
    },
};
