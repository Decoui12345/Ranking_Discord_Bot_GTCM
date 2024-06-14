const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');


const uri = process.env.MONGODB_URI;
const dbName = 'events';
const collectionName = 'eventCurrentStatus';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-reminder-stop')
        .setDescription('Stops the automatic reminder for the events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        console.log(`User: ${interaction.user.tag} executed the command: /event-reminder-stop.`);
        
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
        
        if (global.reminderTasks) {
            global.reminderTasks.forEach(task => task.stop());
            global.reminderTasks = null;
            await interaction.reply({ content: 'The scheduled reminders have been stopped.', ephemeral: true });

            await collection.updateOne(
                {}, 
                { $set: { status: `Automatic reminders have been stopped. This doesn't mean that the rankers aren't available. Please check Event Announcements for updates.`, ranker: null }}
            );
        } else {
            await interaction.reply({ content: 'There are no active reminders to stop.', ephemeral: true });
        }
    }
};
