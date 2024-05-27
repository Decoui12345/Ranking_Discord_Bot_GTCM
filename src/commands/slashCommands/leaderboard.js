/**const { SlashCommandBuilder } = require('discord.js');
const { getLeaderboardMessage } = require('../../utility/leaderboardUtils.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard'),

    async execute(interaction) {
        try {
            const leaderboardMessage = await getLeaderboardMessage();
            interaction.reply({ content: leaderboardMessage });
        } catch (error) {
            console.error('Error executing leaderboard command:', error);
            interaction.reply({ content: 'Error executing leaderboard command' });
        }
    },
};**/

const { SlashCommandBuilder, PermissionFlagsBits, AllowedMentionsTypes } = require('discord.js');
const { getLeaderboardMessage } = require('../../utility/leaderboardUtils'); // Adjust the path as necessary
//const { client } = require('../../index.js');

// Function to remove mentions from a string
//function removeRoleMentions(content) {
   // const mentionRegex = /<@!?\d+>|<@&\d+>/g; // Updated regex to include roles
 //   return content.replace(mentionRegex, '');
//}
/**const guildId = process.env.GUILD_ID; // Replace 'yourGuildIdHere' with the actual ID of your guild
const guild = client.guilds.cache.get(guildId); // Fetch the guild object from the cache using its ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, guild) {
        await interaction.deferReply();
        console.log(`User: ${interaction.user.tag} executed the command: /leaderboard.`);
        
        try {
            let messagesSent = false; // Flag to track whether messages have been sent
            const messageParts = await getLeaderboardMessage();
            for (const part of messageParts) {
               //await interaction.channel.send({ content: part, allowedMentions: { users: [], roles: [] } });
            // Fetch all members in the guild
    guild.members.fetch()
    .then(members => {
        // Iterate through the members and collect their user IDs
        const userIds = members.map(member => member.user.id);
             interaction.channel.send({ content: part, AllowedMentionsTypes: { users: [], roles: [] }, userIds });

                // Remove mentions from each part of the message const sanitizedPart = removeMentions(part); await interaction.channel.send({ content: sanitizedPart });

                // Ensure each part contains necessary information
                //if (!part) continue; // Skip empty parts
                
                // Send the part as it is
                //await interaction.channel.send(part);
            }

            // Once all parts of the message have been sent, set the flag to true
            messagesSent = true;
            console.log('Leaderboard messages sent successfully.');

            // Further processing can be added here if necessary

            if (messagesSent) {
                await interaction.editReply('Ranked');
            }

        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            await interaction.reply('An error occurred while fetching the leaderboard.');
        }

    },
};**/
module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
async execute(interaction) {
        await interaction.deferReply();
        console.log(`User: ${interaction.user.tag} executed the command: /leaderboard.`);
try {
   // const guildId = process.env.GUILD_ID; // Replace 'yourGuildIdHere' with the actual ID of your guild
    //const guild = client.guilds.cache.get(guildId); // Fetch the guild object from the cache using its ID
    
   // if (!guild) {
   //     console.error('Guild not found!');
   //     await interaction.reply('An error occurred while fetching the leaderboard.');
   //     return;
    //}

    //let userIds = [];
   /**  guild.members.fetch()
        .then(members => {
            // Iterate through the members and collect their user IDs
            userIds = members.map(member => member.user.id);
        })
        .catch(error => {
            console.error('Error fetching members:', error);
        });**/

    // Fetch leaderboard message parts
    const messageParts = await getLeaderboardMessage();

    // Flag to track whether messages have been sent
    let messagesSent = false;

    for (const part of messageParts) {
        await interaction.channel.send({ content: part, allowedMentions: { parse: [] } });
    }

    // Once all parts of the message have been sent, set the flag to true
    messagesSent = true;
    console.log('Leaderboard messages sent successfully.');

    // Further processing can be added here if necessary

    if (messagesSent) {
        await interaction.editReply('Ranked');
    }

} catch (error) {
    console.error('Error fetching leaderboard:', error);
    await interaction.reply('An error occurred while fetching the leaderboard.');
}
    }
};
