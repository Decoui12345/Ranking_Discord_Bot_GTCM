// fix the limiter for the button collector so it only accepts 1 response from each ranker

//IDEA: 
    // Change the whole UI cause it's not working the way I want it to anyways
        // The "Reminder Message" that will be sent will now show 2 buttons:
                // "Give my availabilty." and "Check My availability"
                        // - Give my availability will send an ephemeral message for the user that clicked it
                        //          and it will have the ability to give their availability for the next event (the current yes/no button options)
                        //      - future idea: be able to select which event on that day you want to give availibility for

                        // - Check my availability will send an ephemeral message for the user that clicked it
                        //          and it will have the ability to check what you said your availability is for the next event (and maybe future events)
                        //             as well as the ability to click a button like "Change my availability" to shortcut towards the GMA page
                        // - You should be able to check the availability of others as well for the next event
                
        // Updating database info:
            // Queries:
                    // pull from database your current availability


            // Update/input collections:
                    // Make it so it updates the database for logs and /event-status more often to more accurately show the info
                    // log:
                            // Immediately when a ranker says no
                            // Immediately, even before announcement, when a ranker says yes
                            // Put in your availability

        // Notes: 
                // The ephemeral messages will display the current status (meaning if you press yes then it will edit the ephemeral and say you are hosting the event/no then it will disable that button) 
                // Update the query search? Maybe update the way the collection is saved in the Database
                // Might have to edit the time objects on the other collectors (might mess with the timing)
                // Update /event-status command to add a button to it to see the availability of each ranker

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

/* const RANKERS_CHANNEL_ID = '1135037357754695761';
const ANNOUNCEMENTS_CHANNEL_ID = '1166953869293654146';
const EVENT_PING_ROLE_ID = '1156687290895179797';
const RANKER_PING_ROLE_ID = '1134266246456680569'; */
const RANKERS_CHANNEL_ID = '1244081913522688010'; // bot testing
const ANNOUNCEMENTS_CHANNEL_ID = '1244081913522688010'; // bot testing
const EVENT_PING_ROLE_ID = '1222257217227591780'; // wood
const RANKER_PING_ROLE_ID = '1215381867466072204'; // programmer

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
            
            // old first row buttons:

            /* const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('event_yes')
                        .setLabel('Yes')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('event_no')
                        .setLabel('No')
                        .setStyle(ButtonStyle.Danger)
                ); */


                // First page of buttons (server side, aka NOT ephemeral), for availability info
                const avail_row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('give_availability')
                        .setLabel('Give My Availability')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('check_availability')
                        .setLabel('Check My Availability')
                        .setStyle(ButtonStyle.Primary)
                );
            
            // old + new confirmation buttons:
                

                // Second page for give_availability, same as old ones, just to see if you can host event or not
                // Ephemeral
                const yes_no_row = new ActionRowBuilder()
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


                // Third page for give_availability, same as old ones, just to confirm you can host event or accidental click
                // Ephemeral
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


                // For second page of check my availability, under current availability message
                // Ephemeral
                const change_avail = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('change_availability')
                        .setLabel('Change My Current Availability')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('other_rankers')
                        .setLabel('Other Rankers Availability')
                        .setStyle(ButtonStyle.Secondary)
                );

                
                // Initialize global reminderTasks array if not already initialized
                if (!global.reminderTasks) {
                    global.reminderTasks = [];
                }
                
                
                const scheduleReminder = (cronTime, reminderTime) => {
                    const noResponders = new Set();
                    const yesResponder = new Set();
                    
                    
                    
                    
                    
                    const task = cron.schedule(cronTime, async () => {
                        try {
                            console.log('Start of task');
                            // Clear the status and ranker fields
                            await collection.updateOne(
                                {},
                                { $set: { status: `Either the event status is not ready right now. Wait for it to be closer to an event to see the status. Or the rankers haven't said their availability yet.`, ranker: null } }
                            );
                            
                            
                            const availabilityMessage = await rankersChannel.send({
                                // <@&${RANKER_PING_ROLE_ID}>
                                content: `<@&${RANKER_PING_ROLE_ID}> Please give your availability for the next event.\n Scheduled for 1 hour 45 min from now.`,
                                components: [avail_row]
                            });
                            console.log("Sent availability message, see it?");
                            
                            
                            
                            
                            setTimeout(async () => {
                                // After reminderTime minutes, send the reminder message to the announcements channel
                                if (yesResponder.length > 0) {
                                    await announcementsChannel.send(`<@&${EVENT_PING_ROLE_ID}> Event in 1 hour.`);
                                } else {
                                    await announcementsChannel.send(`<@&${EVENT_PING_ROLE_ID}> Next event cancelled. No rankers available.`);
                                }
                            }, reminderTime * 60000); // maybe 1 hour
                            
                            const avail_filter = i => i.customId === 'give_availability' || i.customId === 'check_availability';
                            const avail_collector = availabilityMessage.createMessageComponentCollector({ avail_filter, time: reminderTime * 60000 });
                            
                            
                            avail_collector.on('collect', async i => {
                                console.log('Availability Collector. First Page, collected a response.');
                                
                                if (i.customId === 'give_availability') {
                                    await i.deferReply({ ephemeral: true });
                                    
                                    const yes_no_question_ephemeral = await i.followUp({
                                        content: "Are you able to host next event? 1 hour and 45 min from when the first reminder was sent.", 
                                        components: [yes_no_row], 
                                        ephemeral: true
                                    });
                                    
                                    const yes_no_filter = j => j.customId === 'event_yes' || j.customId === 'event_no';
                                    const yes_no_collector = yes_no_question_ephemeral.createMessageComponentCollector({ filter: yes_no_filter, time: reminderTime * 60000 });
                                    
                                    yes_no_collector.on('collect', async j => {
                                        console.log('Availability Collector. Second Page, collected a response.');
                                        

                                        // If the user said they CAN do the event by pressing the Yes button
                                        if (j.customId === 'event_yes') {
                                            await j.deferReply({ ephemeral: true }); // defers it for more time


                                                            // Error catching: making sure the user hasn't already given their availability to prevent them from spamming it
                                                            if (!yesResponder.has(j.user.id) && !noResponders.has(j.user.id)) {
                                                            yesResponder.add(j.user.id);
                                                            } else if (yesResponder.has(j.user.id)) {
                                                                console.log(`Ranker: ${j.user.id} tried saying yes mulitple times.`);

                                                                await i.deleteReply(); // Deletes the previous message (the one with the yes or no for the event)


                                                                // Has to edit the reply because of discord API and how ephemerals work, gets deleted right after
                                                                await j.editReply({
                                                                    content: "Processed the reply. Deleting this message momentarily.",
                                                                    ephemeral: true
                                                                });
        
                                                                await j.deleteReply(); // deletes the processed message above

                                                                await j.followUp({
                                                                    content: 'You already said you can host this next event.\nIf you want to change your availability go back to the first message and click "Check My Availabilty".',
                                                                    ephemeral: true
                                                                }); 
                                                                return; // Ends becuase the user already responded with their availability
                                                            } else if (noResponders.has(j.user.id)) {
                                                                console.log(`Ranker: ${j.user.username} tried saying yes, when their availability is no`);

                                                                await i.deleteReply(); // Deletes the previous message (the one with the yes or no for the event)


                                                                // Has to edit the reply because of discord API and how ephemerals work, gets deleted right after
                                                                await j.editReply({
                                                                    content: "Processed the reply. Deleting this message momentarily.",
                                                                    ephemeral: true
                                                                });
        
                                                                await j.deleteReply(); // Deletes the processed message

                                                                await j.followUp({
                                                                    content: `You already said you can not do this event.\nIf you wish to change this, please go back to the first message and click "Check My Availability" to change it.`,
                                                                    ephemeral: true
                                                                });
                                                                return; // Ends becuase the user already responded with their availability
                                                            }
                                        
                                            
                                            const confirm_yes_embed = new EmbedBuilder()
                                                .setTitle('Ranker doing the next event:')
                                                .setDescription(`<@${j.user.id}> Updated their availability.\nThey will be hosting this event.`)
                                                .setColor('Green')
                                                .setTimestamp();


                                                await j.editReply({
                                                    content: "Processed the reply. Deleting this message momentarily.",
                                                    ephemeral: true
                                                });

                                                await j.deleteReply();

                                            await j.followUp({ 
                                                embeds: [confirm_yes_embed]
                                            });

                                            const mentionEachUser = [...yesResponder].map( userId => `<@${userId}>`).join(`, `);

                                                        
                                            await collection.updateOne(
                                                {},
                                                { $set: { status: `The next event is scheduled and will start on time.`, ranker: `${mentionEachUser}` } }
                                            );
                                            
                                            await i.deleteReply();
                                            
                                            } else if (j.customId === 'event_no') {
                                                await j.deferReply({ ephemeral: true });


                                                if (!noResponders.has(j.user.id) && !yesResponder.has(j.user.id)) {
                                                    noResponders.add(j.user.id);
                                                    } else if (noResponders.has(j.user.id)) {
                                                        console.log(`Ranker: ${j.user.id} tried saying no mulitple times.`);

                                                        await i.deleteReply();

                                                        await j.editReply({
                                                            content: "Processed the reply. Deleting this message momentarily.",
                                                            ephemeral: true
                                                        });

                                                        await j.deleteReply();
                                                        
                                                        await j.followUp({
                                                            content: `You already said you can not do this event.\nIf you wish to change this, please go back to the first message and click "Check My Availability" to change it.`,
                                                            ephemeral: true
                                                        });
                                                        return;
                                                    } else if (yesResponder.has(j.user.id)) {
                                                        console.log(`Ranker: ${j.user.username} tried saying no, when their availability is yes`);
                                                    
                                                        await i.deleteReply();


                                                        await j.editReply({
                                                            content: "Processed the reply. Deleting this message momentarily.",
                                                            ephemeral: true
                                                        });

                                                        await j.deleteReply();

                                                        await j.followUp({
                                                            content: 'You already said you can host this next event.\nIf you want to change your availability go back to the first message and click "Check My Availabilty".',
                                                            ephemeral: true
                                                        }); 
                                                        
                                                        
                                                        return;
                                                    }
                                                
                                                const confirm_no_embed = new EmbedBuilder()
                                                .setTitle('Ranker not available:')
                                                .setDescription(`<@${j.user.id}> Updated their availability.\nThey can not do the next event.`)
                                                .setColor('Red')
                                                .setTimestamp();

                                                await j.editReply({
                                                    content: "Processed the reply. Deleting this message momentarily.",
                                                    ephemeral: true
                                                });

                                                await j.deleteReply();
                                                console.log('Deleted edited reply, did it work?');

                                                await j.followUp({
                                                    embeds: [confirm_no_embed],
                                                    ephemeral: false
                                                });
                                                console.log("noResponders:", noResponders);

                                                const mentionEachUser = [...noResponders].map( userId => `<@${userId}>`).join(`, `);
                                                
                                                await collection.updateOne(
                                                    {},
                                                    { $set: 
                                                        { status: `There are no available rankers to help with the next event. Cancelled.`, 
                                                          ranker: `Said "No": ${mentionEachUser}` } }
                                                );

                                                await i.deleteReply();

                                    }
                                });

                            } else if (i.customId === 'check_availability') {
                                await i.deferReply({ ephemeral: true });

                                const checking = await i.followUp({
                                    content: 'Checking Availability...',
                                    components: [change_avail],
                                    ephemeral: true
                                });

                                const check_filter = k => k.customId === 'change_availability' || k.customId === 'other_rankers';
                                const check_collector = checking.createMessageComponentCollector({ filter: check_filter, time: reminderTime * 60000 });
 
                                check_collector.on('collect', async k => {
                                    console.log('Check Availability collector. First page, collected a respone.');

                                    if (k.customId === 'change_availability') {

                                    } else if (k.customId === 'other_rankers') {

                                    }
                                    
                                })
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
            scheduleReminder('00 16 * * 1,3,5', 45); // 3:15 PM on Monday, Wednesday, and Friday
            scheduleReminder('02 16 * * 1,3,5', 45);  // 5:45 PM on Monday, Wednesday, and Friday
            scheduleReminder('39 10 * * 1,3,5', 45); // 8:15 PM on Monday, Wednesday, and Friday 
            
            await interaction.reply({ content: 'Reminders have been set for every Monday, Wednesday, and Friday at 3:30 PM, 6:00 PM, and 8:30 PM EST.', ephemeral: true });
        } catch (error) {
            console.error('Failed to fetch channels or roles:', error);
            await interaction.reply({ content: 'There was an error setting up the reminders. Please check the channel and role IDs.', ephemeral: true });
        }/*  finally {
            await client.close();
        } */
    },
};





// Function for populating database if the ranker presses the buttons 'confirm_yes' or 'confirm_no'
async function rankerYesNo(/* confirm yes and confirm no collectors */) {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);

        if (i.customId === 'confirm_yes') {

        }

        if (i.customId === 'confirm_no') {

        }

        /* await db.collection('users').updateOne(
            { userId, rank },
            { $set: { username: user.username, position: newPosition } }
        );

        await db.collection(collectionName).insertOne({
            userId,
            username,
            
        }); */
    } finally {
        await client.close();
    }
}






// Old for reference:


/* try {
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
} */