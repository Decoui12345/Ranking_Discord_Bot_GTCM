/* const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const cron = require('node-cron');
//const moment = require('moment-timezone');
const REMINDER_CHANNEL_ID = '1166953869293654146'; // Replace with your channel ID



module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-reminder-start')
        .setDescription('Starts the automatic reminder for the events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),



        async execute(interaction) {
            console.log(`User: ${interaction.user.tag} executed the command: /event-reminder-start.`);
            const eventPingRoleId = '1156687290895179797';
       // Function to schedule a task
       const scheduleTask = (time, days) => {
        const [hour, minute] = time.split(':');
        return cron.schedule(`0 ${minute} ${hour} * * ${days}`, async () => {
            const channel = await interaction.client.channels.fetch(REMINDER_CHANNEL_ID);
            if (channel) {
                channel.send(`<@&${eventPingRoleId}> Event in 1 hour and 30 minutes`);
            } else {
                console.error('Channel not found!');
            }
        }, {
            timezone: 'America/New_York' // Set the timezone to EST
        });
    };

    // Stop any existing reminder tasks
    if (global.reminderTasks) {
        global.reminderTasks.forEach(task => task.stop());
    }

    // Schedule reminders for 3:30 PM, 6:00 PM, and 8:30 PM EST on Monday, Wednesday, and Friday
    const days = '1,3,5'; // Monday, Wednesday, Friday
    global.reminderTasks = [
        scheduleTask('15:30', days), // 15:30
        scheduleTask('18:00', days), // 18:00
        scheduleTask('20:30', days), // 20:30
    ];

        await interaction.reply({ content: 'Reminders have been set for every Monday, Wednesday, and Friday at 3:30 PM, 6:00 PM, and 8:30 PM EST.', ephemeral: true});
    
        }
}; */








/* const { SlashCommandBuilder, PermissionFlagsBits, MessageActionRow, MessageButton } = require('discord.js');
const cron = require('node-cron');

// const REMINDER_CHANNEL_ID = '1166953869293654146'; // Replace with your reminder channel ID
const RANKERS_CHANNEL_ID = '1166392184564621393'; // Replace with your rankers channel ID
const ANNOUNCEMENTS_CHANNEL_ID = '1244081913522688010'; // Replace with your announcements channel ID
const EVENT_PING_ROLE_ID = '1156687290895179797'; // Replace with your event ping role ID


module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-reminder-start')
        .setDescription('Starts the automatic reminder for the events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        console.log(`User: ${interaction.user.tag} executed the command: /event-reminder-start.`);

        const scheduleTask = (time, days) => {
            const [hour, minute] = time.split(':');
            return cron.schedule(`0 ${minute} ${hour} * * ${days}`, async () => {
                console.log(`Scheduled task triggered at ${hour}:${minute} on days ${days}`);
                const rankersChannel = await interaction.client.channels.fetch(RANKERS_CHANNEL_ID);


                    /* try {
                        console.log(`Fetched rankers channel: ${rankersChannel.id}`);
                    
                        // Test: Send a simple message after fetching the channel
                        await rankersChannel.send('Testing message after fetching the rankers channel.');
                        console.log('Test message sent after fetching the rankers channel.');
                    
                        // Rest of the code for sending the question message with buttons and creating collectors
                    } catch (error) {
                        console.error('Failed to fetch rankers channel or send test message:', error);
                    } *

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('event_yes')
                            .setLabel('Yes')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('event_no')
                            .setLabel('No')
                            .setStyle('DANGER')
                    );

                try {
                    const questionMessage = await rankersChannel.send({
                        content: `Rankers, are you able to host the event in 1 hour and 30 minutes?`,
                        components: [row]
                    });
                    console.log('Question message with buttons sent.');

                    const filter = i => i.customId === 'event_yes';
                    const collector = questionMessage.createMessageComponentCollector({ filter, time: 30000, max: 1 });

                    collector.on('collect', async i => {
                        console.log('Collector received a response.');
                        if (i.customId === 'event_yes') {
                            let announcementsChannel;
                            try {
                                announcementsChannel = await interaction.client.channels.fetch(ANNOUNCEMENTS_CHANNEL_ID);
                                console.log(`Fetched announcements channel: ${announcementsChannel.id}`);
                                await announcementsChannel.send(`<@&${EVENT_PING_ROLE_ID}> Event in 1 hour and 30 minutes`);
                                await i.update({ content: 'Thank you! The reminder has been sent to the announcements channel.', components: [] });
                                console.log('Reminder sent to announcements channel.');
                            } catch (error) {
                                console.error('Failed to fetch announcements channel or send reminder:', error);
                            }
                        }
                    });

                    collector.on('end', collected => {
                        console.log('Collector ended.');
                        if (collected.size === 0) {
                            try {
                                questionMessage.edit({ content: 'No responses received. No reminder has been sent.', components: [] });
                                console.log('No responses received.');
                            } catch (error) {
                                console.error('Failed to edit question message:', error);
                            }
                        }
                    });
                } catch (error) {
                    console.error('Failed to send question message or create collector:', error);
                }
            }, {
                timezone: 'America/New_York' // Set the timezone to EST
            });
        };

        // Stop any existing reminder tasks
        if (global.reminderTasks) {
            global.reminderTasks.forEach(task => task.stop());
        }

        // Schedule reminders for 3:30 PM, 6:00 PM, and 8:30 PM EST on Monday, Wednesday, and Friday
        const days = '1,2,5'; // Monday, Wednesday, Friday
        global.reminderTasks = [
            scheduleTask('18:47', days), // 15:30
            scheduleTask('18:49', days), // 18:00
            scheduleTask('18:51', days), // 20:30
        ];

        await interaction.reply({ content: 'Reminders have been set for every Monday, Wednesday, and Friday at 3:30 PM, 6:00 PM, and 8:30 PM EST.', ephemeral: true });
    }
}; */





const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const cron = require('node-cron');
const { MongoClient } = require('mongodb');
require('dotenv').config();
// const moment = require('moment-timezone');

// Replace with your actual IDs
const RANKERS_CHANNEL_ID = '1135037357754695761';
const ANNOUNCEMENTS_CHANNEL_ID = '1166953869293654146';
const EVENT_PING_ROLE_ID = '1156687290895179797';
const RANKER_PING_ROLE_ID = '1134266246456680569';

const uri = process.env.MONGODB_URI;
const dbName = 'events';
const collectionName = 'eventCurrentStatus';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-reminder-start')
        .setDescription('Starts the automatic reminder for the events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        console.log(`User: ${interaction.user.tag} executed the command: /event-reminder-start.`);

        let client;
        try {
            client = new MongoClient(uri);
            await client.connect();
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            const mongoDBError = new EmbedBuilder()
            .setTitle(`🛑 Error: Something went wrong while trying to connect to the DB`)
            .setDescription('An error occurred while connecting to the database. Please try again later.');
            await interaction.editReply({ embeds: [mongoDBError], ephemeral: true });
            return;
        }

                const db = client.db(dbName);
                const collection = db.collection(collectionName);
                
        try {
                    const docThere = await collection.countDocuments();
                    
                    if (docThere === 0) {
                        await collection.insertOne({
                            status: 'Event reminders not set yet.',
                            ranker: null,
                            // eventNumber: 1,
                            // eventDay: 1,
                });
            }

            // Fetching channels and role
            const rankersChannel = await interaction.client.channels.fetch(RANKERS_CHANNEL_ID);
            const announcementsChannel = await interaction.client.channels.fetch(ANNOUNCEMENTS_CHANNEL_ID);
            const eventPingRole = await interaction.client.guilds.cache.get(interaction.guildId).roles.fetch(EVENT_PING_ROLE_ID);
            const rankerPingRole = await interaction.client.guilds.cache.get(interaction.guildId).roles.fetch(RANKER_PING_ROLE_ID);


            if (!rankersChannel || !announcementsChannel || !eventPingRole || !rankerPingRole) {
                throw new Error('One or more IDs are invalid.');
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('event_yes')
                        .setLabel('Yes')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('event_no')
                        .setLabel('No')
                        .setStyle(ButtonStyle.Danger)
                );

            // Initialize global reminderTasks array if not already initialized
            if (!global.reminderTasks) {
                global.reminderTasks = [];
            }

            
            const scheduleReminder = (cronTime, reminderTime) => {
                const noResponders = [];
                const yesResponder = [];

                const task = cron.schedule(cronTime, async () => {
                    try {
                        // Clear the status and ranker fields
                        await collection.updateOne(
                            {},
                            { $set: { status: `Either the event status is not ready right now. Wait for it to be closer to an event to see the status. Or the rankers haven't said their availability yet.`, ranker: null } }
                        );


                        const questionMessage = await rankersChannel.send({
                            // <@&${RANKER_PING_ROLE_ID}>
                            content: `<@&${RANKER_PING_ROLE_ID}>, are you able to host the event in 1 hour and 30 minutes?`,
                            components: [row]
                        });

                        setTimeout(async () => {
                            // After reminderTime minutes, send the reminder message to the announcements channel
                            if (yesResponder.length > 0) {
                                await announcementsChannel.send(`<@&${EVENT_PING_ROLE_ID}> Event in 1 hour and 30 minutes.`);
                            } else {
                                await announcementsChannel.send(`<@&${EVENT_PING_ROLE_ID}> Next event cancelled. No rankers available.`);
                            }
                        }, reminderTime * 60000);

                        const filter = i => i.customId === 'event_yes' || i.customId === 'event_no';
                        const collector = questionMessage.createMessageComponentCollector({ filter, time: reminderTime * 60000 });

                        let responseReceived = false;

                        collector.on('collect', async i => {
                            console.log('Collector received a response.');
                            responseReceived = true;
                            if (i.customId === 'event_yes') {
                            
                                    yesResponder.push(i.user.username);
                                    // await announcementsChannel.send(`<@&${EVENT_PING_ROLE_ID}> Event in 1 hour and 30 minutes`);
                                    await i.update({ content: `Thank you! The reminder has been sent to the announcements channel. Ranker that will be doing the event: ${i.user.username}`, components: [] });

                                    await collection.updateOne(
                                        {}, 
                                        { $set: { status: `The next event is scheduled and will start on time. `, ranker: `${i.user.username}` } } /* Ranker doing the event will be: ${i.user.username} */
                                    );

                            } else if (i.customId === 'event_no') {
                                noResponders.push(i.user.username);
                                await collection.updateOne(
                                    {}, 
                                    { $set: { status: `There are no available rankers to help with the next event. Cancelled.`, ranker: `Said "No": ${noResponders.join(', ')}` } }
                                );

                                await i.deferUpdate();
                            }
                        });

                        collector.on('end', async () => {
                            if (!responseReceived) {
                                    await questionMessage.edit({ content: `No responses received. No reminder has been sent.`, components: [] });

                                    await announcementsChannel.send(`<@&${EVENT_PING_ROLE_ID}> Next event cancelled. No rankers available.`);

                                    await collection.updateOne(
                                        {}, 
                                        { $set: { status: `There are no available rankers to help with the next event. Cancelled.`, ranker: `No one responded. No available rankers.` } }
                                    );

                            } else if (noResponders.length > 0) {
                                    await questionMessage.edit({ content: `Responded with No: ${noResponders.join(', ')}`, components: [] });

                                    await collection.updateOne(
                                        {}, 
                                        { $set: { status: `There are no available rankers to help with the next event. Cancelled.`, ranker: `Said "No": ${noResponders.join(', ')}` } }
                                    );
                            }
                        });
                    } catch (error) {
                        console.error('Failed to send question message or create collector:', error);
                    }
                }, {
                    scheduled: true,
                    timezone: 'America/New_York'
                });

                // Store the task in the global reminderTasks array
                global.reminderTasks.push(task);
            };

            // Schedule reminders
            scheduleReminder('45 14 * * 1,3,5', 45); // 3:30 PM on Monday, Wednesday, and Friday
            scheduleReminder('15 17 * * 1,3,5', 45);  // 6:00 PM on Monday, Wednesday, and Friday
            scheduleReminder('45 19 * * 1,3,5', 45); // 8:30 PM on Monday, Wednesday, and Friday 

            await interaction.reply({ content: 'Reminders have been set for every Monday, Wednesday, and Friday at 3:30 PM, 6:00 PM, and 8:30 PM EST.', ephemeral: true });
        } catch (error) {
            console.error('Failed to fetch channels or roles:', error);
            await interaction.reply({ content: 'There was an error setting up the reminders. Please check the channel and role IDs.', ephemeral: true });
        }/*  finally {
            await client.close();
        } */
    },
};