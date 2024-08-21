// fix the limiter for the button collector so it only accepts 1 response from each ranker

//IDEA:
        // After clicking yes, it edits the button so it will follow up with a
        // confirmation to make sure they mean yes, then it will update the 
        // database for the /event-status command as well as if they don't press 
        // "yes" on the confirmation then it doesn't do anything and will
        // still let the other rankers edit their availability 



const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const cron = require('node-cron');
const { MongoClient } = require('mongodb');
require('dotenv').config();
// const moment = require('moment-timezone');

const RANKERS_CHANNEL_ID = '1135037357754695761';
const ANNOUNCEMENTS_CHANNEL_ID = '1166953869293654146';
const EVENT_PING_ROLE_ID = '1156687290895179797';
const RANKER_PING_ROLE_ID = '1134266246456680569';
/* const RANKERS_CHANNEL_ID = '1244081913522688010'; // bot testing
const ANNOUNCEMENTS_CHANNEL_ID = '1244081913522688010'; // bot testing
const EVENT_PING_ROLE_ID = '1222257217227591780'; // wood
const RANKER_PING_ROLE_ID = '1215381867466072204'; // programmer */

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
            
            const confirmation_row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_yes')
                        .setLabel('Yes, I confirm.')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('confirm_no')
                        .setLabel(`No, I can't do the event.`)
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
                            content: `<@&${RANKER_PING_ROLE_ID}>, are you able to host the event in 1 hour and 45 minutes?`,
                            components: [row]
                        });

                        setTimeout(async () => {
                            // After reminderTime minutes, send the reminder message to the announcements channel
                            if (yesResponder.length > 0) {
                                await announcementsChannel.send(`<@&${EVENT_PING_ROLE_ID}> Event in 1 hour.`);
                            } else {
                                await announcementsChannel.send(`<@&${EVENT_PING_ROLE_ID}> Next event cancelled. No rankers available.`);
                            }
                        }, reminderTime * 60000); // maybe 1 hour

                        const filter = i => i.customId === 'event_yes' || i.customId === 'event_no';
                        const collector = questionMessage.createMessageComponentCollector({ filter, time: reminderTime * 60000 });
                        
                        
                        collector.on('collect', async i => {
                            console.log('Collector received a response.');
                            
                            if (i.customId === 'event_yes') {
                                await i.update({ content: "Are you sure you're able to host this event? Click Yes if you can, No if this was an accidental click.", components: [confirmation_row] });
                                
                                const confirmationFilter = j => j.customId === 'confirm_yes' || j.customId === 'confirm_no' && j.user.id === i.user.id;
                                const confirmationCollector = i.message.createMessageComponentCollector({ filter: confirmationFilter, time: reminderTime * 60000 });
                                
                                confirmationCollector.on('collect', async j => {
                                    if (j.customId === 'confirm_yes') {
                                        yesResponder.push(j.user.username);
                                        await j.update({ content: `Thank you! The reminder has been sent to the announcements channel. Ranker that will be doing the event: ${j.user.username}`, components: [] });

                                        await collection.updateOne(
                                            {},
                                            { $set: { status: `The next event is scheduled and will start on time.`, ranker: `${j.user.username}` } }
                                        );
                                    } else if (j.customId === 'confirm_no') {
                                        await j.update({ content: questionMessage.content, components: [row] });
                                    }
                                });

                                confirmationCollector.on('end', collected => {
                                    if (!collected.size) {
                                        noResponders.push(i.user.username);
                                    }
                                });
                                
                            } else if (i.customId === 'event_no') {
                                noResponders.push(i.user.username);
                                await i.deferUpdate();
                                
                                await collection.updateOne(
                                    {},
                                    { $set: { status: `There are no available rankers to help with the next event. Cancelled.`, ranker: `Said "No": ${noResponders.join(', ')}` } }
                                );
                                
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
                                
                                await questionMessage.edit({ components: [disabledRow] });
                            }
                        });

                        
                        
                        collector.on('end', async () => {
                            if (noResponders.length === 0 && yesResponder.length === 0) {
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
            scheduleReminder('15 15 * * 1,3,5', 45); // 3:15 PM on Monday, Wednesday, and Friday
            scheduleReminder('45 17 * * 1,3,5', 45);  // 5:45 PM on Monday, Wednesday, and Friday
            scheduleReminder('15 20 * * 1,3,5', 45); // 8:15 PM on Monday, Wednesday, and Friday 
            
            await interaction.reply({ content: 'Reminders have been set for every Monday, Wednesday, and Friday at 3:30 PM, 6:00 PM, and 8:30 PM EST.', ephemeral: true });
        } catch (error) {
            console.error('Failed to fetch channels or roles:', error);
            await interaction.reply({ content: 'There was an error setting up the reminders. Please check the channel and role IDs.', ephemeral: true });
        }/*  finally {
            await client.close();
        } */
    },
};



































// let responseReceived = false;

/* collector.on('collect', async i => {
    console.log('Collector received a response.');

    if (responseReceived) {
        // If a response has already been received, ignore further interactions
        await i.deferUpdate();
        return;
    }

    responseReceived = true; // Set the flag to true indicating a response has been received

    if (i.customId === 'event_yes') {
        await i.update({ content: "Are you sure you're able to host this event? Click Yes if you can, No if this was an accidental click.", components: [confirmation_row] });
       
        //yesResponder.push(i.user.username);
        
    } else if (i.customId === 'confirm_yes') {
        yesResponder.push(i.user.username);
        await i.update({ content: `Thank you! The reminder has been sent to the announcements channel. Ranker that will be doing the event: ${i.user.username}`, components: [] });
        
                await collection.updateOne(
                    {}, 
                    { $set: { status: `The next event is scheduled and will start on time. `, ranker: `${i.user.username}` } }
                );
    } else if (i.customId === 'confirm_no') {
        await i.update({ content: questionMessage, components: [row]})
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
}); */