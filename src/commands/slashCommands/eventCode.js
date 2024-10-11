const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Prod
const earlyAccessChannelId = '1161732444395950150';
const eventAnnouncementsChannelId = '1166953869293654146'; 
const rankersChannelId = '1135037357754695761';


// test
/* const earlyAccessChannelId = '1166392184564621393'; // board
const eventAnnouncementsChannelId = '1244081913522688010'; // bot testing
const rankersChannelId = '1236476570697203822'; // gulag */

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
        .addBooleanOption(option =>
            option
                .setName('send-code-immediately')
                .setDescription('Option for sending the code immediately or not')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        console.log(`User: ${interaction.user.tag} executed the command: /event-code.`);
        const eventCode = interaction.options.getString('code').toUpperCase();
        const note = interaction.options.getString('type-of-event');
        const sendCodeNow = interaction.options.getBoolean('send-code-immediately');
        const unrankedRoleId = '1143970454382596096';
        const eventPingRoleId = '1156687290895179797';

        const messageContent = note ? `<@&${unrankedRoleId}> Code: ${eventCode}\nType of event: ${note}` : `<@&${unrankedRoleId}> Code: ${eventCode}`;

        const earlyAccessChannel = await interaction.client.channels.fetch(earlyAccessChannelId);
        const eventAnnouncementsChannel = await interaction.client.channels.fetch(eventAnnouncementsChannelId);
        const rankersChannel = await interaction.client.channels.fetch(rankersChannelId);

        try {
            if(!sendCodeNow) { // If the user gives false, it will send to early access > 3 min later > regular announcements
                let remainingTime = 180 // 3 minutes in seconds
                await earlyAccessChannel.send(messageContent);

                /* setTimeout(async () => {
                    try{
                        const announcementMessageContent = note ? `<@&${eventPingRoleId}> Code: ${eventCode}\nType of event: ${note}` : `<@&${eventPingRoleId}> Code: ${eventCode}`;
                        await eventAnnouncementsChannel.send(announcementMessageContent);
                    } catch (error) {
                        console.error('Error sending event announcement message:', error);
                        await eventAnnouncementsChannel.send({ content: 'LkdjfsldfkjsdlfkjdsThere was an error sending the event code, please try again or manually send it.'});
                    }
                }, 180000); */
                
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('send-now')
                            .setLabel('Send the Code right now')
                            .setStyle(ButtonStyle.Primary)
                    );


                const sendNowMessage = 'Do you want to send the code right now?';
                const sendingItNow = await rankersChannel.send({ content: `${sendNowMessage}`, components: [row] });

                
                                
                const earlyAccessMessage = await interaction.reply({ content: `Event code sent to early access channel. \`${remainingTime}\` seconds until it sends to event announcements.`, ephemeral: true });

                


                const collector = sendingItNow.createMessageComponentCollector();

                let saidYesToSendingIt = false;

                collector.on('collect', i => {
                    saidYesToSendingIt = true;

                    console.log('Said yes to sending it now.');

                    collector.stop();
                });

                const interval = setInterval(async () => {
                    remainingTime--;

                    if (remainingTime <= 0 || saidYesToSendingIt) {
                        clearInterval(interval);

                        try{
                            const announcementMessageContent = note ? `<@&${eventPingRoleId}> Code: ${eventCode}\nType of event: ${note}` : `<@&${eventPingRoleId}> Code: ${eventCode}`;
                            
                            await eventAnnouncementsChannel.send(announcementMessageContent);
                            await interaction.editReply({ content: 'Event code sent to event announcements.', ephemeral: true });
                        } catch (error) {
                            console.error('Error sending event announcement message:', error);
                            await eventAnnouncementsChannel.send({ content: 'HerererererThere was an error sending the event code, please try again or manually send it.'});
                        }
                        
                        // await earlyAccessMessage.edit({ content: 'Event code has been sent to event announcements.'});

                        await sendingItNow.delete();
                    } else {

                        await earlyAccessMessage.edit({ content: `Event code sent to early access channel. \`${remainingTime}\` seconds until it sends to event announcements.` });
                    }
                }, 1000); // 1 second in ms

                
        
            } else if (sendCodeNow) { // If the user gives true, sends immediately to regular announcements
                try{
                    const announcementMessageContent = note ? `<@&${eventPingRoleId}> Code: ${eventCode}\nType of event: ${note}` : `<@&${eventPingRoleId}> Code: ${eventCode}`;
                    
                    await eventAnnouncementsChannel.send(announcementMessageContent);
                    await interaction.reply({ content: 'Event code sent to event announcements.', ephemeral: true });
                } catch (error) {
                    console.error('Error sending event announcement message:', error);
                    await eventAnnouncementsChannel.send({ content: 'There was an error sending the event code, please try again or manually send it.'});
                }
            }

        } catch (error) {
            console.error('Error sending messages:', error);
            await interaction.reply({ content: 'UThere was an error sending the event code.', ephemeral: true });
        }
    
    }
};



// <t:1728605640:R>