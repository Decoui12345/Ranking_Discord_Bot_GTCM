const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const earlyAccessChannelId = '1161732444395950150';
const eventAnnouncementsChannelId = '1166953869293654146';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-code')
        .setDescription('Sends the event code to early access and then to event announcements after a delay.')
        .addStringOption(option =>
            option
                .setName('code')
                .setDescription('The code for the event.')
                .setRequired(true)
                .setMaxLength(10) // Correct usage of max length
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const eventCode = interaction.options.getString('code').toUpperCase(); // Convert code to uppercase
        const unrankedRoleId = '1143970454382596096';
        const eventPingRoleId = '1156687290895179797';

        try {
            // Fetch channels by their IDs
            const earlyAccessChannel = await interaction.client.channels.fetch(earlyAccessChannelId);
            const eventAnnouncementsChannel = await interaction.client.channels.fetch(eventAnnouncementsChannelId);

            // Send message to early access channel
            await earlyAccessChannel.send(`<@&${unrankedRoleId}> code: ${eventCode}`);
            
            // Inform the user that the message was sent successfully
            await interaction.reply({ content: 'Event code sent to early access channel.', ephemeral: true });

            // Set a timeout to send the message to the event announcements channel after a delay
            setTimeout(async () => {
                await eventAnnouncementsChannel.send(`<@&${eventPingRoleId}> code: ${eventCode}`);
            }, 180000); // equal to 3 minutes
        } catch (error) {
            console.error('Error sending messages:', error);
            await interaction.reply({ content: 'There was an error sending the event code.', ephemeral: true });
        }
    }
};
