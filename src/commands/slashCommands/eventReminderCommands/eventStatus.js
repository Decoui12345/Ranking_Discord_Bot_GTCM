const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI
const dbName = 'events';
const collectionName = 'eventCurrentStatus';


module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-status')
        .setDescription('The status of the upcoming event.'),

    async execute(interaction) {
        await interaction.deferReply();
        console.log(`User: ${interaction.user.tag} executed the command: /event-status.`);

        let client;
        try {
            client = new MongoClient(uri);
            await client.connect();
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            const mongoDBError = new EmbedBuilder()
            .setTitle('🛑 Error: Something went wrong while trying to connect to the DB')
            .setDescription('An error occurred while connecting to the database. Please try again later.');
            await interaction.editReply({ embeds: [mongoDBError], ephemeral: true });
            return;
        }

        try {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            const statusDoc = await collection.findOne({});
            if (!statusDoc) {
                await interaction.editReply({ content: 'No event status found.', ephemeral: true });
                return;
            }

            const eventStatusEmbed = new EmbedBuilder()
                .setTitle('📅 Event Status')
                .addFields(
                    { name: 'Status', value: statusDoc.status, inline: true },
                    { name: 'Ranker', value: statusDoc.ranker || 'N/A', inline: true },
                );

            await interaction.editReply({ embeds: [eventStatusEmbed], ephemeral: true });
        } catch (error) {
            console.error('Error fetching event status:', error);
            await interaction.editReply({ content: 'There was an error fetching the event status.', ephemeral: true });
        } finally {
            client.close();
        }

    }
};