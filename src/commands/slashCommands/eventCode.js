/* const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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
        console.log(`User: ${interaction.user.tag} executed the command: /event-code.`);
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
}; */


// src/commands/slashCommands/eventCode.js
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
                .setMaxLength(10)
        )
        .addStringOption(option =>
            option
                .setName('type-of-event')
                .setDescription('An optional note to include with the event code that describes what the event will be.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        console.log(`User: ${interaction.user.tag} executed the command: /event-code.`);
        const eventCode = interaction.options.getString('code').toUpperCase();
        const note = interaction.options.getString('type-of-event');
        const unrankedRoleId = '1143970454382596096';
        const eventPingRoleId = '1156687290895179797';

        const messageContent = note ? `<@&${unrankedRoleId}> Code: ${eventCode}\nType of event: ${note}` : `<@&${unrankedRoleId}> Code: ${eventCode}`;

        try {
            const earlyAccessChannel = await interaction.client.channels.fetch(earlyAccessChannelId);
            const eventAnnouncementsChannel = await interaction.client.channels.fetch(eventAnnouncementsChannelId);

            await earlyAccessChannel.send(messageContent);

            await interaction.reply({ content: 'Event code sent to early access channel.', ephemeral: true });

            setTimeout(async () => {
                try{
                    const announcementMessageContent = note ? `<@&${eventPingRoleId}> Code: ${eventCode}\nType of event: ${note}` : `<@&${eventPingRoleId}> Code: ${eventCode}`;
                    await eventAnnouncementsChannel.send(announcementMessageContent);
                } catch (error) {
                    console.error('Error sending event announcement message:', error);
                    await eventAnnouncementsChannel.send({ content: 'There was an error sending the event code, please try again or manually send it.'});
                }
            }, 180000);
        } catch (error) {
            console.error('Error sending messages:', error);
            await interaction.reply({ content: 'There was an error sending the event code.', ephemeral: true });
        }
    }
};
