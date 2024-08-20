// fix the limiter for the button collector so it only accepts 1 response from each ranker





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
                        
                            if (responseReceived) {
                                // If a response has already been received, ignore further interactions
                                await i.deferUpdate();
                                return;
                            }
                        
                            responseReceived = true; // Set the flag to true indicating a response has been received
                        
                            if (i.customId === 'event_yes') {
                                yesResponder.push(i.user.username);
                                await i.update({ content: `Thank you! The reminder has been sent to the announcements channel. Ranker that will be doing the event: ${i.user.username}`, components: [] });
                        
                                await collection.updateOne(
                                    {}, 
                                    { $set: { status: `The next event is scheduled and will start on time. `, ranker: `${i.user.username}` } }
                                );
                        
                            } else if (i.customId === 'event_no') {
                                noResponders.push(i.user.username);
                                await i.deferUpdate();
                        
                                await collection.updateOne(
                                    {}, 
                                    { $set: { status: `There are no available rankers to help with the next event. Cancelled.`, ranker: `Said "No": ${noResponders.join(', ')}` } }
                                );
                        
                                // Disable only the "No" button for the user who clicked it
                                const disabledRow = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('event_yes')
                                            .setLabel('Yes')
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setCustomId('event_no')
                                            .setLabel('No')
                                            .setStyle(ButtonStyle.Danger)
                                            .setDisabled(true) // Disable the "No" button for this user
                                    );
                        
                                questionMessage.edit({
                                    components: [disabledRow]
                                });
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