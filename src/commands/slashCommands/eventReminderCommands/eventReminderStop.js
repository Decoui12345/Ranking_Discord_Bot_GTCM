const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-reminder-stop')
        .setDescription('Stops the automatic reminder for the events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        console.log(`User: ${interaction.user.tag} executed the command: /event-reminder-stop.`);
        if (global.reminderTasks) {
            global.reminderTasks.forEach(task => task.stop());
            global.reminderTasks = null;
            await interaction.reply({ content: 'The scheduled reminders have been stopped.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There are no active reminders to stop.', ephemeral: true });
        }
    }
};
